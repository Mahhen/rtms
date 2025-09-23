"use client"

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronRight, Loader2, MapPin } from "lucide-react";
import { fetchTrains, TrainScheduleData } from "@/api/traindet";
import IRLogo from "@/components/ir-logo";
import { cn } from "@/lib/utils";
import { HeroInput } from "@/components/hero-input";
import { useSearchParams, useRouter } from "next/navigation";

export default function TrainSearchResults() {
  const [loading, setLoading] = useState(true);
  const [isError, setError] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [trains, setTrains] = useState<TrainScheduleData[]>([]);
  const [masterDetail, setMasterDetail] = useState<TrainScheduleData>();

  const router = useRouter();

  const params = useSearchParams();
  const paramData = {
    from: params.get("from") ?? "",
    to: params.get("to") ?? "",
    date: params.get("date") ?? "",
    __boardingDisplay: params.get("__boardingDisplay") ?? "",
    __destinationDisplay: params.get("__destinationDisplay") ?? "",
  };

  const today = new Date(paramData.date); // todo: use travel date

  const weekdays = ["Sun.", "Mon.", "Tue.", "Wed.", "Thu.", "Fri.", "Sat."];

  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();

  useEffect(() => {
    (async () => {
      if (paramData.from && paramData.to) {
        const trainData = await fetchTrains(paramData.from, paramData.to);

        if (trainData) {
          let filtered = trainData;

          // 🔹 Filter trains by runningstatus & date
          if (paramData.date) {
            const travelDate = new Date(paramData.date);
            const travelDayIndex = travelDate.getDay(); // 0=Sun ... 6=Sat
            filtered = trainData.filter(
              (train) => train.runningstatus[travelDayIndex] === "1"
            );
          }

          setTrains(filtered);
          if (filtered.length > 0) setMasterDetail(filtered[0]);
        } else setError(true);

        setLoading(false);
        setSelectionMode(true);
      }
    })();
  }, [paramData.from, paramData.to, paramData.date]);

  const prettifiedDuration = (duration: string | undefined): string => {
    if (!duration) {
      return "null";
    }
    const data = duration.split(".");
    const hr = Number(data[0]);
    const min = Number(data[1]);
    return `${hr} h ${min} min`;
  };
  const [isAuth, setAuth] = useState(false);

useEffect(() => {
  (async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch("/api/verify-token", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      },
    });

    setAuth(res.ok);
  })();
}, []);

  function selectTicket() {
    if (masterDetail) {
      const trainNumber = masterDetail.trainNumber;
      const journeyDate = paramData.date;
      const src = paramData.from;
      const dest = paramData.to;
      const distance = masterDetail.distance;

      const params = new URLSearchParams({
        trainNumber: trainNumber.toString(),
        journeyDate: journeyDate,
        src: src.toString(),
        dest: dest.toString(),
        distance: distance.toString()     
      }).toString();

      router.push(`/seatselection?${params}`);
    }
  }

  return (
    <div className="bg-[#f6f6f6]">
      <div className="p-6 space-y-1 pb-10 w-full">
        <div className="relative border rounded-sm p-4 bg-blue-800 min-h-[100px]">
          <div className="flex justify-center">
            <div className="absolute">
              <HeroInput simplifiedSearchMode initialValues={paramData} />
            </div>
          </div>
        </div>

        {loading ? (
          isError ? (
            <div className="flex justify-center items-center py-20">
              API error encountered.
            </div>
          ) : (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="animate-spin w-8 h-8 text-muted-foreground" />
            </div>
          )
        ) : (
          <div className="flex flex-row mx-auto gap-1 justify-center mt-30">
            <div className="grid gap-1 w-[500px]">
              {trains.map((train) => (
                <Card
                  key={train.trainNumber}
                  className={cn(
                    "rounded-[5px] border shadow-none hover:shadow-xl border-solid p-0 hover:cursor-pointer",
                    masterDetail?.trainNumber === train.trainNumber
                      ? "border-2 border-solid border-black"
                      : ""
                  )}
                  onClick={() => setMasterDetail(train)}
                >
                  <CardContent className="p-3 flex flex-col items-start min-w-[60px]">
                    <div className="flex flex-row place-items-center">
                      <div>
                        <IRLogo />
                      </div>
                      <div className="ml-4">
                        <div className="border-[1px] border-red-500 border-solid rounded-xs ml-[-10] text-sm font-semibold text-red-500">
                          <div className="mx-1">{train.trainNumber}</div>
                        </div>
                      </div>
                      <div className="text-xs ml-2 place-self-center">
                        {train.trainName}
                      </div>
                    </div>
                    <div className="mt-2 flex flex-row place-items-center w-full">
                      <div className="text-sm font-semibold">
                        {train.departureTime}
                      </div>
                      <div className="col-span-4 w-full mx-5">
                        <div className="flex items-center">
                          <div className="h-2 w-2 rounded-full bg-black" />
                          <div className="w-full h-[1.5px] bg-black relative" />
                          <div className="h-2 w-2 rounded-full bg-black" />
                        </div>
                      </div>
                      <div className="ml-auto text-sm font-semibold">
                        {train.arrivalTime}
                      </div>
                    </div>
                    <div className="flex flex-row mt-2 place-items-center w-full">
                      <div className="text-sm">Pl. 2</div>
                      <div className="grow"></div>
                      <div className="text-sm">
                        {prettifiedDuration(train.travelDuration)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="ml-5">
              <Card className="rounded-sm shadow-none min-w-[500px] pb-0">
                <CardContent className="relative">
                  <div className="flex flex-row place-items-center">
                    <div className="text-lg font-semibold">
                      {masterDetail?.departs}
                    </div>
                    <ArrowRight
                      className="h-4"
                      color={"oklch(55.1% 0.027 264.364)"}
                    />
                    <div className="text-lg font-semibold">
                      {masterDetail?.arrivesAt}
                    </div>
                  </div>
                  <div className="flex flex-row place-items-center">
                    <div className="text-sm text-gray-700">
                      {weekdays[today.getDay()]} {day}.{month}.{year},{" "}
                      {prettifiedDuration(masterDetail?.travelDuration)}
                    </div>
                  </div>
                  <div className="mt-2 flex flex-row place-items-center w-full">
                    <div className="text-sm font-semibold">
                      {masterDetail?.departureTime}
                    </div>
                    <div className="col-span-4 w-full mx-5">
                      <div className="flex items-center">
                        <div className="h-2 w-2 rounded-full bg-black" />
                        <div className="w-full h-[1.5px] bg-black relative" />
                        <div className="h-2 w-2 rounded-full bg-black" />
                      </div>
                    </div>
                    <div className="ml-auto text-sm font-semibold">
                      {masterDetail?.arrivalTime}
                    </div>
                  </div>
                  <div className="static mt-4 mx-[-25] h-[1px] bg-[#e5e5e5]" />
                  <div className="grid grid-cols-2 divide-x-[1.5px] divide-[#e5e5e5]">
                    <div className="flex flex-col p-4">
                      <div className="text-xs text-gray-500">1AC</div>
                      <div className="text-sm font-semibold">from INR {masterDetail ? Math.floor(Number(masterDetail.distance) * 2.7952755) : "-"}</div>
                    </div>
                    <div className="flex flex-col p-4">
                      <div className="text-xs text-gray-500">2AC</div>
                      <div className="text-sm font-semibold">from INR {masterDetail ? Math.floor(Number(masterDetail.distance) * 1.657122) : "-"}</div>
                    </div>
                  </div>
                  <div className="static mx-[-25] h-[1px] bg-[#e5e5e5]" />
                  <div className="grid grid-cols-2 divide-x-[1.5px] divide-[#e5e5e5]">
                    <div className="flex flex-col p-4">
                      <div className="text-xs text-gray-500">3AC</div>
                      <div className="text-sm font-semibold">from INR {masterDetail ? Math.floor(Number(masterDetail.distance) * 1.1524695) : "-"}</div>
                    </div>
                    <div className="flex flex-col p-4">
                      <div className="text-xs text-gray-500">Sleeper</div>
                      <div className="text-sm font-semibold">from INR {masterDetail ? Math.floor(Number(masterDetail.distance) * 0.433070866) : "-"}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="rounded-sm shadow-none py-4 my-2 hover:cursor-pointer hover:shadow-lg">
                <div className="flex flex-row place-items-center w-full">
                  <div className="ml-10">
                    <MapPin
                      className="h-4 w-4"
                      color={"oklch(55.1% 0.027 264.364)"}
                    />
                  </div>
                  <div className="text-sm text-gray-700 ml-2">
                    {masterDetail?.departs}
                  </div>
                  <div className="ml-auto">
                    <div className="text-sm text-gray-800">Show map</div>
                  </div>
                  <ChevronRight className="h-4 w-4 mx-2" />
                </div>
              </Card>
              <Card className="rounded-sm shadow-none py-4 my-2">
                <div className="flex flex-col text-sm font-medium">
                  <div className="flex items-center">
                    <span className="w-12 text-right self-start">
                      {masterDetail?.departureTime}
                    </span>
                    <div className="relative flex flex-col mx-2 items-center">
                      <div className="w-2 h-2 bg-black rounded-full"></div>
                      <div className="absolute">
                        <div className="relative flex flex-row">
                          <div className="flex-1 w-[1.5px] bg-black min-h-[100px]"></div>
                          <div className="absolute ml-3.5 mt-7 flex flex-col w-[200px]">
                            <div className="flex flex-row">
                              <IRLogo />
                              <div className="ml-2 text-gray-600">
                                {masterDetail?.trainName}
                              </div>
                            </div>
                            <div className="mt-1">
                              <span className="bg-red-600 text-white text-xs px-1 py-0.5 rounded font-bold">
                                IR {masterDetail?.trainNumber}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {masterDetail?.departs}
                    <div className="font-normal text-gray-500">
                      &nbsp;{masterDetail?.departCode}
                    </div>
                  </div>
                  <div className="min-h-[80px]" />
                  <div className="flex items-center">
                    <span className="w-12 text-right">
                      {masterDetail?.arrivalTime}
                    </span>
                    <div className="flex flex-col items-center mx-2">
                      <div className="w-2 h-2 bg-black rounded-full"></div>
                    </div>
                    {masterDetail?.arrivesAt}
                    <div className="font-normal text-gray-500">
                      &nbsp;{masterDetail?.arrivalCode}
                    </div>
                  </div>
                </div>
              </Card>
              <Card className="rounded-sm shadow-none py-4 my-2 hover:cursor-pointer hover:shadow-lg">
                <div className="flex flex-row place-items-center w-full">
                  <div className="ml-10">
                    <MapPin
                      className="h-4 w-4"
                      color={"oklch(55.1% 0.027 264.364)"}
                    />
                  </div>
                  <div className="text-sm text-gray-700 ml-2">
                    {masterDetail?.arrivesAt}
                  </div>
                  <div className="ml-auto">
                    <div className="text-sm text-gray-800">Show map</div>
                  </div>
                  <ChevronRight className="h-4 w-4 mx-2" />
                </div>
              </Card>
            </div>
          </div>
        )}
        {selectionMode && (
          <div className="sticky bottom-0 bg-white rounded-lg w-full min-h-[70px] ">
            
                {
                  isAuth ?
                  <>
                <div className="flex flex-col h-[70px] justify-center">
                  <div className="ml-auto mr-[275px]">
                    <Button className="bg-red-500 hover:bg-red-700 shadow-lg shadow-red-500/50" onClick={selectTicket}>
                      Select Tickets
                    </Button>
                  </div>
                </div>
                
                </>
                :
                <>
                
                
                <div className="flex flex-row gap-3 h-[70px] justify-center items-center">
                  <div className="ml-[10%]">
                    <p>Please Login to Select your Seats</p>

                    </div>                    
                  <div className="ml-auto mr-[275px]">
                    <Button className="bg-red-500 hover:bg-red-700 shadow-lg shadow-red-500/50" onClick={selectTicket}>
                 
                  <a href="/login" className="ml-2">Login</a>
                </Button>
                  </div>
                </div>
                
                </>

                }
              
          </div>
        )}
      </div>
    </div>
  );
}
