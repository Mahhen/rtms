// No "use client" directive here! This is a universal utility file.

export type SeatType = "LB" | "MB" | "UB" | "SL" | "SU"

export type Seat = {
  id: string
  type: SeatType
  selected: boolean
  sold?: boolean
}

// ---------------- SEAT GENERATORS ----------------
export const BAY_COUNT = 8

function createBay2AC(bayNumber: number): Seat[] { // 2AC layout
  return [
    { id: `LB${bayNumber}A`, type: "LB", selected: false, sold: false },
    { id: `UB${bayNumber}A`, type: "UB", selected: false, sold: false },
    { id: `LB${bayNumber}B`, type: "LB", selected: false, sold: false },
    { id: `UB${bayNumber}B`, type: "UB", selected: false, sold: false },
    { id: `SL${bayNumber}`, type: "SL", selected: false, sold: false },
    { id: `SU${bayNumber}`, type: "SU", selected: false, sold: false },
  ]
}

function createBay3AC(bayNumber: number): Seat[] { // 3AC & Sleeper layout
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

function createBay1AC(bayNumber: number): Seat[] { // 1AC layout
  return [
    { id: `LB${bayNumber}A`, type: "LB", selected: false, sold: false },
    { id: `UB${bayNumber}A`, type: "UB", selected: false, sold: false },
    { id: `LB${bayNumber}B`, type: "LB", selected: false, sold: false },
    { id: `UB${bayNumber}B`, type: "UB", selected: false, sold: false },
  ]
}

export function generateSeatsForTier(tier: string): Seat[] {
  if (tier === "3AC" || tier === "Sleeper") {
    return Array.from({ length: BAY_COUNT }, (_, i) => createBay3AC(i + 1)).flat()
  } else if (tier === "1AC") {
    return Array.from({ length: BAY_COUNT }, (_, i) => createBay1AC(i + 1)).flat()
  } else if (tier === "2AC") {
    // Corrected to use createBay2AC
    return Array.from({ length: BAY_COUNT }, (_, i) => createBay2AC(i + 1)).flat()
  }
  return []
}

// You might also want to export BAY_COUNT and other related types if they are used elsewhere