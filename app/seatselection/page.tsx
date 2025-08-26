"use client"

import React, { useState } from "react"
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

type SeatType = "LB" | "UB" | "SL" | "SU"

type Seat = {
  id: string
  type: SeatType
  selected: boolean
}

function createBay(bayNumber: number): Seat[] {
  return [
    { id: `LB${bayNumber}A`, type: "LB", selected: false },
    { id: `UB${bayNumber}A`, type: "UB", selected: false },
    { id: `LB${bayNumber}B`, type: "LB", selected: false },
    { id: `UB${bayNumber}B`, type: "UB", selected: false },
    { id: `SL${bayNumber}`, type: "SL", selected: false },
    { id: `SU${bayNumber}`, type: "SU", selected: false },
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
  const [seats, setSeats] = useState<Seat[]>(() =>
    Array.from({ length: BAY_COUNT }, (_, i) => createBay(i + 1)).flat()
  )

  const [selectedTier, setSelectedTier] = useState<string>("")
  const [selectedCoach, setSelectedCoach] = useState<string>("")

  const [tierOpen, setTierOpen] = useState(false)
  const [coachOpen, setCoachOpen] = useState(false)

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
        onClick={() => toggleSeat(id)}
        role="button"
        aria-pressed={seat.selected}
        title={id}
        className={cn(
          "w-12 h-12 flex items-center justify-center rounded-md border text-sm font-medium cursor-pointer transition",
          seat.selected
            ? "bg-blue-600 text-white border-blue-600"
            : "bg-gray-100 hover:bg-gray-200 border-gray-300"
        )}
      >
        {label}
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">Select Your Seats</h1>

      <div className="flex gap-8">
        {/* LEFT SIDE - Combobox Controls */}
        <div className="flex flex-col gap-4">
          {/* Tier Combobox */}
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
                          setSelectedCoach("") // reset coach
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

        {/* RIGHT SIDE - Seat Layout */}
        
          <div className="flex-1 border rounded-lg p-4 bg-white shadow-sm mr-auto w-304">
            <div className="text-center font-semibold text-gray-700 mb-2">
              Washrooms
            </div>
            <hr className="border-gray-300 mb-4" />

            {Array.from({ length: BAY_COUNT }, (_, i) => {
              const n = i + 1
              return (
                <div key={n} className="mb-4">
                  <div className="flex justify-between">
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2">
                        {renderSeat(`LB${n}A`, "LB")}
                        {renderSeat(`UB${n}A`, "UB")}
                      </div>
                      <div className="flex gap-2">
                        {renderSeat(`LB${n}B`, "LB")}
                        {renderSeat(`UB${n}B`, "UB")}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2">
                        {renderSeat(`SL${n}`, "SL")}
                        {renderSeat(`SU${n}`, "SU")}
                      </div>
                    </div>
                  </div>
                  <hr className="border-gray-200 mt-3" />
                </div>
              )
            })}

            <div className="text-center font-semibold text-gray-700 mt-2">
              Washrooms
            </div>
            
            {/* Bottom Confirm Section */}
        
          <div className="mt-6 flex flex-col items-center gap-3 sticky bottom-0 border-solid border-3 bg-white w-[inherit] ml-[inherit] p-6 rounded-xl">
            <h3 className="text-lg font-semibold">Selected Seats:</h3>
            <p className="text-gray-700">
            {seats.filter(s => s.selected).map(s => s.id).join(", ") || "None"}
            </p>
          <Button
            className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() =>
              alert(
                `Tier: ${selectedTier || "None"}\nCoach: ${
                  selectedCoach || "None"
                }\nSeats: ${
                  seats.filter(s => s.selected).map(s => s.id).join(", ") || "None"
                }`
              )
            }
          >
            Confirm Seats
          </Button>
        
      </div>
        </div>
      </div>

      
    </div>
  )
}
