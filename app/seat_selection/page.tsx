import React, { useState } from "react";
import "./page.css";
   // new CSS for dropdowns

type SeatType = "LB" | "UB" | "SL" | "SU";

type Seat = {
  id: string;
  type: SeatType;
  selected: boolean;
};

function createBay(bayNumber: number): Seat[] {
  return [
    { id: `LB${bayNumber}A`, type: "LB", selected: false },
    { id: `UB${bayNumber}A`, type: "UB", selected: false },
    { id: `LB${bayNumber}B`, type: "LB", selected: false },
    { id: `UB${bayNumber}B`, type: "UB", selected: false },
    { id: `SL${bayNumber}`, type: "SL", selected: false },
    { id: `SU${bayNumber}`, type: "SU", selected: false },
  ];
}

const BAY_COUNT = 8;

// mapping Tier -> Coaches
const coachOptions: Record<string, string[]> = {
  "1AC": ["A"],
  "2AC": ["B1", "B2"],
  "3AC": ["C1", "C2", "C3", "C4"],
  "Sleeper": ["D1", "D2", "D3", "D4", "D5"],
};

export default function TrainSeats() {
  const [seats, setSeats] = useState<Seat[]>(() =>
    Array.from({ length: BAY_COUNT }, (_, i) => createBay(i + 1)).flat()
  );

  const [selectedTier, setSelectedTier] = useState<string>("");
  const [selectedCoach, setSelectedCoach] = useState<string>("");

  const toggleSeat = (id: string) => {
    setSeats(prev =>
      prev.map(s => (s.id === id ? { ...s, selected: !s.selected } : s))
    );
  };

  const renderSeat = (id: string, label: SeatType) => {
    const seat = seats.find(s => s.id === id);
    if (!seat) return null;
    return (
      <div
        className={`seat ${seat.selected ? "selected" : ""}`}
        onClick={() => toggleSeat(id)}
        role="button"
        aria-pressed={seat.selected}
        title={id}
      >
        {label}
      </div>
    );
  };

  return (
    <div className="page">
      <h1>Select Your Seats</h1>

      <div className="layout">
        {/* LEFT SIDE DROPDOWNS */}
        <div className="controls">
          <label>
            Tier:
            <select
              value={selectedTier}
              onChange={(e) => {
                setSelectedTier(e.target.value);
                setSelectedCoach(""); // reset coach when tier changes
              }}
            >
              <option value="">-- Select Tier --</option>
              <option value="1AC">1AC</option>
              <option value="2AC">2AC</option>
              <option value="3AC">3AC</option>
              <option value="Sleeper">Sleeper</option>
            </select>
          </label>

          <label>
            Coach:
            <select
              value={selectedCoach}
              onChange={(e) => setSelectedCoach(e.target.value)}
              disabled={!selectedTier}  // disable until tier selected
            >
              <option value="">-- Select Coach --</option>
              {selectedTier &&
                coachOptions[selectedTier].map(coach => (
                  <option key={coach} value={coach}>
                    {coach}
                  </option>
                ))}
            </select>
          </label>
        </div>

        {/* RIGHT SIDE - COACH LAYOUT */}
        <div className="coach">
          <div className="washroom">Washrooms</div>
          <hr className="line" />
          {Array.from({ length: BAY_COUNT }, (_, i) => {
            const n = i + 1;
            return (
              <div className="seat-row" key={n}>
                <div className="bay">
                  <div className="left">
                    <div className="row">
                      {renderSeat(`LB${n}A`, "LB")}
                      {renderSeat(`UB${n}A`, "UB")}
                    </div>
                    <div className="row">
                      {renderSeat(`LB${n}B`, "LB")}
                      {renderSeat(`UB${n}B`, "UB")}
                    </div>
                  </div>
                  <div className="right">
                    <div className="row">
                      {renderSeat(`SL${n}`, "SL")}
                      {renderSeat(`SU${n}`, "SU")}
                    </div>
                  </div>
                </div>
                <hr className="bay-divider" />
              </div>
            );
          })}
          <div className="washroom">Washrooms</div>
        </div>
        <div className="selected_seats">
        <h3>Selected Seats:</h3>
        <p>{seats.filter(s => s.selected).map(s => s.id).join(", ") || "None"}</p>
        
      </div>
      </div>
      
      {/* Bottom Selected Seats */}
      <div className="button_thing">
        <h3>Selected Seats:</h3>
        <p>{seats.filter(s => s.selected).map(s => s.id).join(", ") || "None"}</p>
        <button
          className="confirm-button"
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
          <h4>Confirm Seats</h4>
        </button>
      </div>
    </div>
  );
}