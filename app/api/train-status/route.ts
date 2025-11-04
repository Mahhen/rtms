import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const trainNumber = searchParams.get("train");

  if (!trainNumber) {
    return NextResponse.json({ error: "Missing ?train=" }, { status: 400 });
  }

  try {
    const url = `https://www.railrestro.com/live-train-running-status/${trainNumber}?day=yesterday`;
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    const html = await res.text();
    const $ = cheerio.load(html);

    const trainName = $("h1").first().text().trim() || "N/A";
    const currentPosition =
      $(".running-status-summary").first().text().trim() || "N/A";
    const lastUpdated = $(".last_update").first().text().trim() || "N/A";
    const overallDelay = $(".delay-status").first().text().trim() || "N/A";

    const stations: any[] = [];
    let currentIndex = -1;

    $(".table.track_tbl tbody tr").each((i, el) => {
      const tds = $(el).find("td");
      if (tds.length < 5) return;

      const isCurrent = $(tds[0]).hasClass("ind-current");
      if (isCurrent) currentIndex = i;

      const stationHTML = $(tds[1]).html() || "";
      const station = stationHTML.match(/^(.*?)<br/i)?.[1]?.trim() || "";
      const distance =
        stationHTML.match(/<small>(.*?)<\/small>/i)?.[1]?.trim() || "";
      const platform =
        stationHTML.match(/Platform\s*#\s*(\d+)/i)?.[1]?.trim() || "N/A";

      const dateHTML = $(tds[2]).html() || "";
      const [day, date] =
        dateHTML.match(/Day\s*\d+|[0-9]{1,2}-[A-Za-z]{3}/g) || ["", ""];

      const arrHTML = $(tds[3]).html() || "";
      const depHTML = $(tds[4]).html() || "";

      const scheduledArrival =
        arrHTML.match(/<del.*?>(.*?)<\/del>/)?.[1]?.trim() || "";
      const actualArrival =
        arrHTML.match(/<b>(.*?)<\/b>/)?.[1]?.trim() || "";
      const scheduledDeparture =
        depHTML.match(/<del.*?>(.*?)<\/del>/)?.[1]?.trim() || "";
      const actualDeparture =
        depHTML.match(/<b>(.*?)<\/b>/)?.[1]?.trim() || "";
      const delay =
        depHTML.match(/Delayed by.*?<b>(.*?)<\/b>/i)?.[1]?.trim() || "";

      stations.push({
        station,
        distance,
        platform,
        day,
        date,
        arrival: { scheduled: scheduledArrival, actual: actualArrival },
        departure: { scheduled: scheduledDeparture, actual: actualDeparture },
        delay,
        isCurrent,
      });
    });

    // progress bar: based on index of current station
    const progressPercent =
      currentIndex >= 0 && stations.length > 0
        ? Math.round(((currentIndex + 1) / stations.length) * 100)
        : 0;

    return NextResponse.json({
      trainNumber,
      trainName,
      overallDelay,
      currentPosition,
      lastUpdated,
      stations,
      currentIndex,
      progressPercent,
    });
  } catch (err: any) {
    console.error("❌ Scrape error:", err);
    return NextResponse.json(
      { error: "Failed to fetch or parse data", details: err.message },
      { status: 500 }
    );
  }
}
