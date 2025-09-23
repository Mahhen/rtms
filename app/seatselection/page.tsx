  "use client"

  import React, { useState, useEffect, useMemo, useCallback } from "react"
  import { CheckIcon, ChevronsUpDownIcon } from "lucide-react"
  import { cn } from "@/lib/utils"
  import { useRouter } from "next/navigation";
  import { useSearchParams } from "next/navigation"
  import {toast} from "sonner"

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

  // Import from the new utility file, including BAY_COUNT
  import { generateSeatsForTier, Seat, SeatType, BAY_COUNT } from "@/lib/seat-utils";

  const coachOptions: Record<string, string[]> = {
    "1AC": ["A1"],
    "2AC": ["B1", "B2", "B3"],
    "3AC": ["C1", "C2", "C3", "C4", "C5"],
    Sleeper: ["S1", "S2", "S3", "S4", "S5", "S6"],
  }

  const tierOptions = ["1AC", "2AC", "3AC", "Sleeper"]

  export default function TrainSeats() {
    const [seats, setSeats] = useState<Seat[]>([])
    const [selectedTier, setSelectedTier] = useState<string>("")
    const [selectedCoach, setSelectedCoach] = useState<string>("")
    const [loadingSeats, setLoadingSeats] = useState<boolean>(false)

    const [tierOpen, setTierOpen] = useState(false)
    const [coachOpen, setCoachOpen] = useState(false)

    const router = useRouter();
    const params = useSearchParams();
    const trainNumber = String(params.get("trainNumber") ?? "");
    const journeyDateParam = params.get("journeyDate");
    const journeyDate = useMemo(() => new Date(journeyDateParam ?? ""), [journeyDateParam]);
    const src = String(params.get("src") ?? "");
    const dest = String(params.get("dest") ?? "");
    const distance = Number(params.get("distance") ?? "0");

    const selectedSeatsCount = useMemo(() => seats.filter(s => s.selected).length, [seats]);

    // useEffect for fetching seat data remains the same
    useEffect(() => {
      async function fetchAndSetSeats() {
        if (!selectedTier || !selectedCoach || !trainNumber || !journeyDateParam || !src || !dest) {
          setSeats([]);
          return;
        }

        setLoadingSeats(true);
        try {
          const generatedSeats = generateSeatsForTier(selectedTier);

          const response = await fetch(
            `/api/seatselection?train_no=${trainNumber}&date=${journeyDate.toISOString()}&class_name=${selectedTier}&coach_name=${selectedCoach}&seat_type=default&src=${encodeURIComponent(src)}&dest=${encodeURIComponent(dest)}`
          );

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          const soldSeats = data.success
            ? data.bookedSeats.map((s: any) => s.seat_number.includes("-") ? s.seat_number.split("-")[1] : s.seat_number)
            : [];

          setSeats(
            generatedSeats.map(s =>
              soldSeats.includes(s.id) ? { ...s, sold: true } : s
            )
          );
        } catch (err: any) {
          console.error("❌ Failed to fetch seats:", err);
          toast(`Error fetching seats: ${err.message || "Could not load seat availability. Please try again."}`);
          
          setSeats([]);
        } finally {
          setLoadingSeats(false);
        }
      }
      fetchAndSetSeats();
    }, [selectedTier, selectedCoach, trainNumber, journeyDate, journeyDateParam, src, dest]);

    const toggleSeat = useCallback((id: string) => {
      setSeats(prev =>
        prev.map(s => (s.id === id ? { ...s, selected: !s.selected } : s))
      )
    }, []);

    const renderSeat = useCallback((id: string, label: SeatType) => {
      const seat = seats.find(s => s.id === id);
      if (!seat) return null;
      return (
        <div
          onClick={() => !seat.sold && toggleSeat(id)}
          role="button"
          aria-pressed={seat.selected}
          title={id}
          className={cn(
            "flex items-center justify-center rounded-md border text-sm font-medium transition-all duration-150",
            "w-12 h-12 m-1",
            seat.sold
              ? "bg-red-500 text-white border-red-600 cursor-not-allowed opacity-70"
              : seat.selected
                ? "bg-blue-600 text-white border-blue-600 shadow-md"
                : "bg-white text-gray-600 border-blue-600 hover:bg-blue-50"
          )}
        >
          {label}
        </div>
      );
    }, [seats, toggleSeat]);

    // --- START: MODIFIED SECTION ---

    /**
     * Replaces the old handleConfirmBooking function.
     * Gathers all necessary data and navigates to the passenger details page.
     */
    const handleProceedToPassengerDetails = () => {
      const selectedSeats = seats.filter(s => s.selected);

      if (selectedSeats.length === 0) {
        toast("Please select at least one seat to proceed.");
        return;
      }

      // Create a URLSearchParams object to safely build the query string
      const paramsToPass = new URLSearchParams({
        trainNumber: trainNumber,
        journeyDate: journeyDate.toISOString(), // Pass date as a consistent ISO string
        src: src,
        dest: dest,
        distance: String(distance),
        selectedTier: selectedTier,
        selectedCoach: selectedCoach,
        // Join selected seat IDs into a single comma-separated string
        selectedSeats: selectedSeats.map(s => s.id).join(","),
      });

      // Navigate to the new passenger details page with all data in the URL
      router.push(`/passenger-details?${paramsToPass.toString()}`);
    };

    // --- END: MODIFIED SECTION ---


    // Layout components (DefaultLayout, ThreeACLayout, OneACLayout) remain exactly the same.
    // ... (Paste your unchanged layout components here) ...
    const DefaultLayout = () => ( // 2AC layout
      <div className="border-2 border-gray-200 rounded-3xl p-4 bg-white shadow-lg w-[520px] ml-16">
        <div className="text-center text-lg font-semibold mb-3">Washrooms</div>
        <hr className="border-gray-300 my-3" />
        {Array.from({ length: BAY_COUNT }, (_, i) => {
          const n = i + 1
          return (
            <div key={n} className="mb-4">
              <div className="flex justify-between items-center px-4">
                <div className="flex flex-col gap-1">
                  <div className="flex">
                    {renderSeat(`LB${n}A`, "LB")}
                    {renderSeat(`UB${n}A`, "UB")}
                  </div>
                  <div className="flex">
                    {renderSeat(`LB${n}B`, "LB")}
                    {renderSeat(`UB${n}B`, "UB")}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex">{renderSeat(`SL${n}`, "SL")}</div>
                  <div className="flex">{renderSeat(`SU${n}`, "SU")}</div>
                </div>
              </div>
              <hr className="border-gray-200 mt-3" />
            </div>
          )
        })}
        <div className="text-center text-lg font-semibold mt-6">Washrooms</div>
      </div>
    )
    const ThreeACLayout = () => ( // 3AC & Sleeper layout
      <div className="border-2 border-gray-200 rounded-3xl p-4 bg-white shadow-lg w-[520px] ml-16">
        <div className="text-center text-lg font-semibold mb-3">Washrooms</div>
        <hr className="border-gray-300 my-3" />
        {Array.from({ length: BAY_COUNT }, (_, i) => {
          const n = i + 1
          return (
            <div key={n} className="mb-4">
              <div className="flex justify-between items-center px-4">
                <div className="flex flex-col gap-1">
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
                <div className="flex flex-col gap-1">
                  <div className="flex">{renderSeat(`SL${n}`, "SL")}</div>
                  <div className="flex">{renderSeat(`SU${n}`, "SU")}</div>
                </div>
              </div>
              <hr className="border-gray-200 mt-3" />
            </div>
          )
        })}
        <div className="text-center text-lg font-semibold mt-6">Washrooms</div>
      </div>
    )
    const OneACLayout = () => (
      <div className="border-2 border-gray-200 rounded-3xl p-4 bg-white shadow-lg w-[520px] ml-16">
        <div className="text-center text-lg font-semibold mb-3">Washrooms</div>
        <hr className="border-gray-300 my-3" />
        {Array.from({ length: BAY_COUNT }, (_, i) => {
          const n = i + 1
          return (
            <div key={n} className="mb-4">
              <div className="flex flex-col gap-1 items-center justify-center">
                <div className="flex gap-1">
                  {renderSeat(`LB${n}A`, "LB")}
                  {renderSeat(`UB${n}A`, "UB")}
                </div>
                <div className="flex gap-1">
                  {renderSeat(`LB${n}B`, "LB")}
                  {renderSeat(`UB${n}B`, "UB")}
                </div>
              </div>
              <hr className="border-gray-200 mt-3" />
            </div>
          )
        })}
        <div className="text-center text-lg font-semibold mt-6">Washrooms</div>
      </div>
    )

    return (
      <div className="p-6 space-y-6 container mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Select Your Seats</h1>
        <div className="flex flex-col lg:flex-row lg:gap-12 items-start justify-center">
          {/* LEFT SIDE - Combobox Controls */}
          <div className="flex flex-col gap-6 w-full lg:w-auto p-4 border rounded-lg shadow-sm bg-white mb-6 lg:mb-0">
            <h2 className="text-xl font-semibold text-gray-800">Booking Options</h2>
            {/* Tier Combobox */}
            <div className="space-y-2">
              <b className="text-gray-700">Select Tier :</b>
              <Popover open={tierOpen} onOpenChange={setTierOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" aria-expanded={tierOpen} className="w-full justify-between">
                    {selectedTier || "Select Tier"}
                    <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
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
                              setSelectedTier(val);
                              setSelectedCoach("");
                              setTierOpen(false);
                            }}
                          >
                            <CheckIcon
                              className={cn("mr-2 h-4 w-4", selectedTier === tier ? "opacity-100" : "opacity-0")}
                            />
                            {tier}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            {/* Coach Combobox */}
            <div className="space-y-2">
              <b className="text-gray-700">Select Coach :</b>
              <Popover open={coachOpen} onOpenChange={setCoachOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" aria-expanded={coachOpen} className="w-full justify-between" disabled={!selectedTier}>
                    {selectedCoach || "Select Coach"}
                    <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                  <Command>
                    <CommandInput placeholder="Search coach..." />
                    <CommandList>
                      <CommandEmpty>No coach found.</CommandEmpty>
                      <CommandGroup>
                        {selectedTier && coachOptions[selectedTier]?.map(coach => (
                          <CommandItem
                            key={coach}
                            value={coach}
                            onSelect={val => {
                              setSelectedCoach(val);
                              setCoachOpen(false);
                            }}
                          >
                            <CheckIcon
                              className={cn("mr-2 h-4 w-4", selectedCoach === coach ? "opacity-100" : "opacity-0")}
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
          </div>
          {/* RIGHT SIDE - Seat Layout + Arrow + Legend + Seat Stats */}
          {selectedTier && selectedCoach && (
            <div className="flex flex-col lg:flex-row items-center lg:items-start lg:gap-8 w-full">
              <div className="flex-shrink-0 mb-6 lg:mb-0">
                {loadingSeats ? (
                  <div className="flex items-center justify-center h-96 w-[520px] bg-gray-100 rounded-3xl shadow-lg animate-pulse">
                    <p className="text-gray-500 text-lg">Loading Seats...</p>
                  </div>
                ) : (
                  <>
                    {selectedTier === "1AC" && <OneACLayout />}
                    {selectedTier === "2AC" && <DefaultLayout />}
                    {(selectedTier === "3AC" || selectedTier === "Sleeper") && <ThreeACLayout />}
                  </>
                )}
              </div>
              <div className="flex flex-col items-center gap-6 lg:mt-0 sticky top-4 lg:top-20">
                <div className="flex flex-col items-center">
                  <span className="text-gray-600 font-semibold mb-2">Direction of Travel</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-10 text-blue-600 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m0 0l-7 7m7-7l7 7" />
                  </svg>
                </div>
                <div className="flex flex-col gap-3 p-4 border rounded-lg shadow-sm bg-white w-full max-w-xs">
                  <h3 className="text-md font-semibold text-gray-700 mb-2">Legend</h3>
                  <div className="flex items-center gap-2"><div className="w-6 h-6 rounded-md bg-blue-600 border"></div><span className="text-gray-700 text-sm">Selected Seat</span></div>
                  <div className="flex items-center gap-2"><div className="w-6 h-6 rounded-md bg-red-500 border"></div><span className="text-gray-700 text-sm">Sold Seat</span></div>
                  <div className="flex items-center gap-2"><div className="w-6 h-6 rounded-md bg-white border border-blue-600"></div><span className="text-gray-700 text-sm">Available Seat</span></div>
                </div>
                <div className="flex flex-col gap-3 p-5 border rounded-lg shadow-sm bg-white w-full max-w-xs mt-4">
                  <h3 className="text-md font-semibold text-gray-700">Seat Stats</h3>
                  <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-gray-500"></span><span>Total: {seats.length}</span></div>
                  <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-500"></span><span>Available: {seats.filter(s => !s.sold).length}</span></div>
                  <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-500"></span><span>Sold: {seats.filter(s => s.sold).length}</span></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* --- START: MODIFIED BOTTOM CONFIRM SECTION --- */}
        {selectedTier && selectedCoach && seats.length > 0 && (
          <div className="mt-8 flex flex-col items-center gap-3 sticky bottom-0 bg-white w-full p-6 rounded-xl shadow-lg border-t-2 border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800">Selected Seats:</h3>
            <p className="text-gray-700 text-lg">
              {selectedSeatsCount > 0 ? seats.filter(s => s.selected).map(s => s.id).join(", ") : "None"}
            </p>
            <Button
              className="px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-lg font-medium transition-colors duration-200"
              onClick={handleProceedToPassengerDetails} // Use the new handler
              disabled={selectedSeatsCount === 0 || loadingSeats}
            >
              {/* Updated Button Text */}
              Proceed to Passenger Details
            </Button>
          </div>
        )}
        {/* --- END: MODIFIED BOTTOM CONFIRM SECTION --- */}
      </div>
    );
  }