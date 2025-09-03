"use client"

import React, { useState, useEffect } from "react"
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useSearchParams } from "next/navigation"

type SeatType = "LB" | "MB" | "UB" | "SL" | "SU"

type Seat = {
  id: string
  type: SeatType
  selected: boolean
  sold?: boolean
}

// ---------------- SEAT GENERATORS ----------------

// 2AC (Default)
function createBay(bayNumber: number): Seat[] {
  return [
    { id: `LB${bayNumber}A`, type: "LB", selected: false, sold: false },
    { id: `UB${bayNumber}A`, type: "UB", selected: false, sold: false },
    { id: `LB${bayNumber}B`, type: "LB", selected: false, sold: false },
    { id: `UB${bayNumber}B`, type: "UB", selected: false, sold: false },
    { id: `SL${bayNumber}`, type: "SL", selected: false, sold: false },
    { id: `SU${bayNumber}`, type: "SU", selected: false, sold: false },
  ]
}

// 3AC & Sleeper
function createBay3AC(bayNumber: number): Seat[] {
  return [
    { id: `LB${bayNumber}A`, type: "LB", selected: false, sold: false },
    { id: `MB${bayNumber}A`, type: "MB", selected: false, sold: false },
    { id: `UB${bayNumber}A`, type: "UB", selected: false, sold: false },

    { id: `SL${bayNumber}`, type: "SL", selected: false, sold: false },
    { id: `SU${bayNumber}`, type: "SU", selected: false, sold: false },

    { id: `LB${bayNumber}B`, type: "LB", selected: false, sold: false },
    { id: `MB${bayNumber}B`, type: "MB", selected: false, sold: false },
    { id: `UB${bayNumber}B`, type: "UB", selected: false, sold: false },
  ]
}

// 1AC
function createBay1AC(bayNumber: number): Seat[] {
  return [
    { id: `LB${bayNumber}A`, type: "LB", selected: false, sold: false },
    { id: `UB${bayNumber}A`, type: "UB", selected: false, sold: false },
    { id: `LB${bayNumber}B`, type: "LB", selected: false, sold: false },
    { id: `UB${bayNumber}B`, type: "UB", selected: false, sold: false },
  ]
}


const BAY_COUNT = 8

const coachOptions: Record<string, string[]> = {
  "1AC": ["A"],
  "2AC": ["B1", "B2"],
  "3AC": ["C1", "C2", "C3", "C4"],
  Sleeper: ["D1", "D2", "D3", "D4", "D5"],
}

const tierOptions = ["1AC", "2AC", "3AC", "Sleeper"]

export default function TrainSeats() {
  const [seats, setSeats] = useState<Seat[]>([])
  const [selectedTier, setSelectedTier] = useState<string>("")
  const [selectedCoach, setSelectedCoach] = useState<string>("")

  const [tierOpen, setTierOpen] = useState(false)
  const [coachOpen, setCoachOpen] = useState(false)

  const params = useSearchParams();
  const trainNumber = Number(params.get("trainNumber") ?? "0");
  const journeyDate = new Date(params.get("journeyDate") ?? "")


  // whenever tier & coach are chosen, generate seat layout
              useEffect(() => {
        if (selectedTier && selectedCoach) {
          let generatedSeats: Seat[] = []

          if (selectedTier === "3AC" || selectedTier === "Sleeper") {
            generatedSeats = Array.from({ length: BAY_COUNT }, (_, i) => createBay3AC(i + 1)).flat()
          } else if (selectedTier === "1AC") {
            generatedSeats = Array.from({ length: BAY_COUNT }, (_, i) => createBay1AC(i + 1)).flat()
          } else {
            generatedSeats = Array.from({ length: BAY_COUNT }, (_, i) => createBay(i + 1)).flat()
          }

          console.log("Generated Seats:", generatedSeats)

          if (generatedSeats.length === 0) {
            console.error("⚠️ No seats generated for", selectedTier, selectedCoach)
            return
          }

          fetch("/api/seatselection")
            .then(res => res.json())
            .then(data => {
              // ✅ Ensure array
              const docs = Array.isArray(data) ? data : [data]

              const soldSeats = docs.flatMap((doc: any) =>
                doc.classes?.flatMap((cls: any) =>
                  cls.bookedSeats.map((s: any) => s.seat_number)
                ) || []
              )

              console.log("Sold seats:", soldSeats)

              setSeats(
                generatedSeats.map(s =>
                  soldSeats.includes(s.id) ? { ...s, sold: true } : s
                )
              )
            })
            .catch(err => {
              console.error("❌ Failed to fetch seats:", err)
            })
        } else {
          setSeats([])
        }
      }, [selectedTier, selectedCoach])





      const toggleSeat = (id: string) => {
        setSeats(prev =>
          prev.map(s => (s.id === id ? { ...s, selected: !s.selected } : s))
        )
      }

      const renderSeat = (id: string, label: SeatType) => {
        const seat = seats.find(s => s.id === id)
        if (!seat) return null
        return (
          <div
            onClick={() => !seat.sold && toggleSeat(id)} // disable click if sold
            role="button"
            aria-pressed={seat.selected}
            title={id}
            className={cn(
              "flex items-center justify-center rounded-md border text-sm font-medium cursor-pointer transition",
              "w-[48px] h-[48px] m-[4px]",
              seat.sold
                ? "bg-red-500 text-white border-red-600 cursor-not-allowed opacity-70"
                : seat.selected
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-600 border-blue-600 hover:bg-blue-50"
            )}
          >
      {label}
    </div>
  )
  }

  // ---------------- Layout Components ----------------

  const DefaultLayout = () => (
    <div className="border rounded-[150px] p-15 bg-white shadow-sm w-130 ml-28.5">
      <div className="ml-40">Washrooms</div>
      <hr className="border-gray-200 mt-3 mb-3" />
      {Array.from({ length: BAY_COUNT }, (_, i) => {
        const n = i + 1
        return (
          <div key={n} className="mb-4">
            <div className="flex flex-row gap-50 pl-4">
              <div className="flex flex-col">
                <div className="flex">
                  {renderSeat(`LB${n}A`, "LB")}
                  {renderSeat(`UB${n}A`, "UB")}
                </div>
                <div className="flex">
                  {renderSeat(`LB${n}B`, "LB")}
                  {renderSeat(`UB${n}B`, "UB")}
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex">{renderSeat(`SL${n}`, "SL")}</div>
                <div className="flex">{renderSeat(`SU${n}`, "SU")}</div>
              </div>
            </div>
            <hr className="border-gray-200 mt-3" />
          </div>
        )
      })}
      <div className="ml-40 mt-6">Washrooms</div>
    </div>
  )

  const ThreeACLayout = () => (
    <div className="border rounded-[150px] bg-white shadow-sm w-130 ml-28.5 pl-16 pt-15 pb-15 pr-10">
      <div className="ml-40">Washrooms</div>
      <hr className="border-gray-200 mt-3 mb-3" />
      {Array.from({ length: BAY_COUNT }, (_, i) => {
        const n = i + 1
        return (
          <div key={n} className="mb-6">
            <div className="flex justify-centre">
              {/* Main Section: LB | MB | UB */}
              <div className="flex flex-col gap-2">
                <div className="flex">
                  {renderSeat(`LB${n}A`, "LB")}
                  {renderSeat(`MB${n}A`, "MB")}
                  {renderSeat(`UB${n}A`, "UB")}
                </div>
                <div className="flex">
                  {renderSeat(`LB${n}B`, "LB")}
                  {renderSeat(`MB${n}B`, "MB")}
                  {renderSeat(`UB${n}B`, "UB")}
                </div>
              </div>

              {/* Side Section: SL | SU */}
              <div className="flex flex-col ml-40">
                <div className="flex">{renderSeat(`SL${n}`, "SL")}</div>
                <div className="flex">{renderSeat(`SU${n}`, "SU")}</div>
              </div>
            </div>

            <hr className="w-[400px] mt-4 border-gray pr-[80px]" />
          </div>
        )
      })}
      <div className="ml-40 mt-6">Washrooms</div>
    </div>
  )

  const OneACLayout = () => (
    <div className="border rounded-[150px] p-10 bg-white shadow-sm w-130 ml-28.5 ">
      <div className="ml-45">Washrooms</div>
      <hr className="border-gray-200 mt-3 mb-3 w-100 ml-5" />
      {Array.from({ length: BAY_COUNT }, (_, i) => {
        const n = i + 1
        return (
          <div key={n} className="mb-6">
            <div className="flex flex-col gap-2 pl-40">
              <div className="flex mr-4">
                {renderSeat(`LB${n}A`, "LB")}
                {renderSeat(`UB${n}A`, "UB")}
              </div>
              <div className="flex">
                {renderSeat(`LB${n}B`, "LB")}
                {renderSeat(`UB${n}B`, "UB")}
              </div>
            </div>
            <hr className="border-gray-200 mt-4" />
          </div>
        )
      })}
      <div className="ml-40 mt-6">Washrooms</div>
    </div>
  )

  // Reuse ThreeACLayout for Sleeper
  const SleeperLayout = ThreeACLayout

  // ---------------- MAIN RETURN ----------------

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center ml-3">Select Your Seats</h1>

      <div className="flex gap-8">
        {/* LEFT SIDE - Combobox Controls */}
        <div className="flex flex-col gap-4 ml-25">
          {/* Tier Combobox */}
          <b>Select Tier :</b>
          <Popover open={tierOpen} onOpenChange={setTierOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={tierOpen}
                className="w-48 justify-between"
              >
                {selectedTier || "Select Tier"}
                <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-0">
              <Command>
                <CommandInput placeholder="Search tier..." />
                <CommandList>
                  <CommandEmpty>No tier found.</CommandEmpty>
                  <CommandGroup>
                    {tierOptions.map(tier => (
                      <CommandItem
                        key={tier}
                        value={tier}
                        onSelect={val => {
                          setSelectedTier(val)
                          setSelectedCoach("")
                          setTierOpen(false)
                        }}
                      >
                        <CheckIcon
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedTier === tier ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {tier}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {/* Coach Combobox */}
          <b>Select Coach :</b>
          <Popover open={coachOpen} onOpenChange={setCoachOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={coachOpen}
                className="w-48 justify-between"
                disabled={!selectedTier}
              >
                {selectedCoach || "Select Coach"}
                <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-0">
              <Command>
                <CommandInput placeholder="Search coach..." />
                <CommandList>
                  <CommandEmpty>No coach found.</CommandEmpty>
                  <CommandGroup>
                    {selectedTier &&
                      coachOptions[selectedTier].map(coach => (
                        <CommandItem
                          key={coach}
                          value={coach}
                          onSelect={val => {
                            setSelectedCoach(val)
                            setCoachOpen(false)
                          }}
                        >
                          <CheckIcon
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedCoach === coach
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {coach}
                        </CommandItem>
                      ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* RIGHT SIDE - Seat Layout + Arrow + Legend */}
        {selectedTier && selectedCoach && (
          <div className="flex items-start gap-12 ml-8.5">
            {/* Seat Layout */}
            <>
              {selectedTier === "1AC" && <OneACLayout />}
              {selectedTier === "2AC" && <DefaultLayout />}
              {selectedTier === "3AC" && <ThreeACLayout />}
              {selectedTier === "Sleeper" && <SleeperLayout />}
            </>

            {/* Travel Direction Arrow */}
            <div className="flex flex-col items-center mt-0 sticky top-20">
              <span className="text-gray-600 font-semibold mb-2">
                Direction of Travel
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-20 w-10 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 19V5m0 0l-7 7m7-7l7 7"
                />
              </svg>
            </div>

            {/* Legend Section */}
            <div className="flex flex-col gap-3 p-4 border rounded-lg shadow-sm bg-white mt-0 ml-5 sticky top-20">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-blue-600 border"></div>
                <span className="text-gray-700 text-sm">Selected Seat</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-red-500 border"></div>
                <span className="text-gray-700 text-sm">Sold Seat</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-white border border-blue-600"></div>
                <span className="text-gray-700 text-sm">Available Seat</span>
              </div>
            </div>
          </div>
        )}
      </div>

            {/* Seat Stats Section */}
      <div className="flex flex-col gap-3 p-4 border rounded-lg shadow-sm bg-white ml-260 top-0 w-[400px] sticky">
        <h3 className="text-md font-semibold text-gray-700">Seat Stats</h3>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-gray-500"></span>
          <span>Total: {seats.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-500"></span>
          <span>Available: {seats.filter(s => !s.sold).length}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500"></span>
          <span>Sold: {seats.filter(s => s.sold).length}</span>
        </div>
      </div>


      {/* Bottom Confirm Section */}
      {seats.length > 0 && (
        <div className="mt-6 flex flex-col items-center gap-3 sticky bottom-0 border bg-white w-full p-6 rounded-xl">
          <h3 className="text-lg font-semibold">Selected Seats:</h3>
          <p className="text-gray-700">
            {seats.filter(s => s.selected).map(s => s.id).join(", ") || "None"}
          </p>
                    <Button
            className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => {
              const bookedSeats = seats.filter(s => s.selected).map(s => ({
                seat_number: s.id,
                source: "SRC",       // replace dynamically
                destination: "DST",  // replace dynamically
              }))

              if (bookedSeats.length === 0) {
                alert("Please select at least one seat")
                return
              }

              fetch("/api/seatselection", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  train_no: trainNumber,          // replace dynamically
                  journey_date: journeyDate.toLocaleDateString(), // replace dynamically
                  class_name: selectedTier,
                  seat_type: "General",
                  seats: bookedSeats,
                }),
              })
                .then(res => res.json())
                .then(data => {
                  if (data.success) {
                    // ✅ get fresh sold seats list
                    const soldSeats = data.data.classes.flatMap((cls: any) =>
                      cls.bookedSeats.map((s: any) => s.seat_number)
                    )

                    // ✅ mark them as sold in UI
                    setSeats(prev =>
                      prev.map(s =>
                        soldSeats.includes(s.id)
                          ? { ...s, sold: true, selected: false }
                          : s
                      )
                    )

                    alert("Booking confirmed ✅")
                  } else {
                    alert("Booking failed ❌ " + (data.error || "Unknown error"))
                  }
                })
                .catch(() => alert("Server error ❌"))
            }}
          >
            Confirm Seats
          </Button>



        </div>
      )}
    </div>
  )
}