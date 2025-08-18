"use client";

import { ArrowDownRight, Star, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface Hero3Props {
  heading?: string;
  description?: string;
  buttons?: {
    primary?: { text: string; url: string };
    secondary?: { text: string; url: string };
  };
  reviews?: { count: number; rating?: number };
}

const Hero3 = ({
  heading = "Book Railway Tickets instantly with RailBuddy Today!",
  description = "Search trains, check real-time seat availability, book tickets securely, and manage your journeys — all in one streamlined platform.",
  buttons = {
    primary: { text: "Sign Up", url: "#" },
    secondary: { text: "Login", url: "#" },
  },
  reviews = { count: 200, rating: 5.0 },
}: Hero3Props) => {
  const stations = ["Delhi", "Mumbai", "Chennai", "Kolkata", "Bangalore"];
  const classs = [
    "AC First Class",
    "AC Second Class",
    "AC Third Class",
    "AC Sleeper",
    "Sleeper Class",
    "General Class",
  ];

  const [activeTab, setActiveTab] = useState<"book" | "pnr">("book");

  const [fromStation, setFromStation] = useState("");
  const [toStation, setToStation] = useState("");
  const [classType, setClassType] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [pnr, setPnr] = useState("");

  const swapStations = () => {
    setFromStation(toStation);
    setToStation(fromStation);
  };

  const handleSearch = () => {
    if (activeTab === "book") {
      if (!fromStation || !toStation || !classType || !departureDate) {
        alert("Please fill all fields.");
        return;
      }
      if (fromStation === toStation) {
        alert("From and To stations cannot be the same!");
        return;
      }
      console.log(
        `Searching trains from ${fromStation} to ${toStation} on ${departureDate} (${classType})`
      );
    } else {
      if (!pnr) {
        alert("Please enter PNR number.");
        return;
      }
      console.log(`Checking PNR status for ${pnr}`);
    }
  };

  return (
    <section className="relative flex items-center justify-center min-h-[90vh]">
      <div className="container grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
        {/* Left Side */}
        <div className="mx-auto flex flex-col items-center text-center md:ml-auto lg:max-w-3xl lg:items-start lg:text-left">
          <h1 className="my-6 text-pretty text-4xl font-bold lg:text-6xl xl:text-7xl">
            {heading}
          </h1>
          <p className="text-muted-foreground mb-8 max-w-xl lg:text-xl">
            {description}
          </p>

          {/* Reviews */}
          <div className="flex w-fit flex-col items-center gap-4 sm:flex-row mb-6">
            <div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    className="size-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
                <span className="mr-1 font-semibold">
                  {reviews.rating?.toFixed(1)}
                </span>
              </div>
              <p className="text-muted-foreground text-left font-medium">
                from {reviews.count}+ reviews
              </p>
            </div>
          </div>

          {/* Tabs + Search Bar */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 
            bg-white/40 backdrop-blur-md border border-white/50 shadow-lg 
            rounded-2xl p-6 w-full max-w-4xl">

            {/* Tabs */}
            <div className="flex gap-6 border-b pb-2 mb-4">
              <button
                onClick={() => setActiveTab("book")}
                className={`pb-2 font-semibold ${
                  activeTab === "book"
                    ? "text-rose-700 border-b-2 border-rose-700"
                    : "text-gray-500"
                }`}
              >
                🚆 Book a Train
              </button>
              <button
                onClick={() => setActiveTab("pnr")}
                className={`pb-2 font-semibold ${
                  activeTab === "pnr"
                    ? "text-rose-700 border-b-2 border-rose-700"
                    : "text-gray-500"
                }`}
              >
                🎫 PNR Status
              </button>
            </div>

            {/* Book a Train Form */}
            {activeTab === "book" ? (
              <div className="flex flex-col md:flex-row items-center gap-4">
                {/* From */}
                <div className="flex items-center border border-white/50 bg-white/50 rounded-lg px-3 py-2 w-full md:w-auto">
                  <select
                    value={fromStation}
                    onChange={(e) => setFromStation(e.target.value)}
                    className="outline-none w-full bg-transparent text-black"
                  >
                    <option value="">From</option>
                    {stations.map((station) => (
                      <option key={station} value={station}>
                        {station}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={swapStations}
                    className="ml-2 p-1 hover:bg-white/30 rounded"
                  >
                    <Shuffle size={16} className="text-black" />
                  </button>
                </div>

                {/* To */}
                <div className="flex items-center border border-white/50 bg-white/50 rounded-lg px-3 py-2 w-full md:w-auto">
                  <select
                    value={toStation}
                    onChange={(e) => setToStation(e.target.value)}
                    className="outline-none w-full bg-transparent text-black"
                  >
                    <option value="">To</option>
                    {stations.map((station) => (
                      <option key={station} value={station}>
                        {station}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date */}
                <div className="flex items-center border border-white/50 bg-white/50 rounded-lg px-3 py-2 w-full md:w-auto">
                  <input
                    type="date"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    className="outline-none w-full bg-transparent text-black"
                  />
                </div>

                {/* Class */}
                <div className="flex items-center border border-white/50 bg-white/50 rounded-lg px-3 py-2 w-full md:w-auto">
                  <select
                    value={classType}
                    onChange={(e) => setClassType(e.target.value)}
                    className="outline-none w-full bg-transparent text-black"
                  >
                    <option value="">Class</option>
                    {classs.map((clas) => (
                      <option key={clas} value={clas}>
                        {clas}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Search Button */}
                <Button
                  onClick={handleSearch}
                  className="bg-rose-700 hover:bg-rose-800 text-white rounded-full px-6 py-2 w-full md:w-auto"
                >
                  Search Trains
                </Button>
              </div>
            ) : (
              // PNR Form
              <div className="flex gap-4 items-center">
                <input
                  type="text"
                  placeholder="Enter PNR Number"
                  value={pnr}
                  onChange={(e) => setPnr(e.target.value)}
                  className="p-3 border border-white/50 bg-white/50 rounded-lg w-full outline-none text-black"
                />
                <Button
                  onClick={handleSearch}
                  className="bg-rose-700 hover:bg-rose-800 text-white rounded-full px-6 py-2"
                >
                  Check Status
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Right Side */}
        <div className="flex">
          <img
            src="https://res.cloudinary.com/dx0me99re/image/upload/v1755026464/train_sguwzu.jpg"
            className="max-h-[600px] w-full rounded-md object-cover lg:max-h-[800px]"
          />
        </div>
      </div>
    </section>
  );
};

export { Hero3 };
