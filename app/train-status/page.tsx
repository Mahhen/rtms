"use client";
import { useEffect, useState, FormEvent } from "react";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

// Helper type for station data (improves TypeScript safety)
interface Station {
  station: string;
  arrival: { scheduled: string; actual: string };
  departure: { scheduled: string; actual: string };
  delay: string;
  platform: string;
  isCurrent: boolean;
}

// Main component
export default function TrainStatusPage() {
  const [train, setTrain] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [countdown, setCountdown] = useState(60);

  async function fetchStatus(e?: FormEvent) {
    if (e) e.preventDefault(); // Prevent form submission reload
    if (!train.trim()) return;

    setLoading(true);
    setData(null); // Clear previous data
    try {
      const res = await fetch(`/api/train-status?train=${train}`);
      const json = await res.json();
      setData(json);
      setCountdown(60); // Reset countdown on new fetch
    } catch (err) {
      console.error(err);
      setData({ error: "Failed to fetch data" });
    } finally {
      setLoading(false);
    }
  }

  // Auto-refresh logic (unchanged, but solid)
  useEffect(() => {
    if (!autoRefresh || !train.trim()) return;
    const interval = setInterval(() => {
      fetchStatus();
    }, 60000);
    return () => clearInterval(interval);
  }, [autoRefresh, train]);

  // Countdown timer (unchanged)
  useEffect(() => {
    if (!autoRefresh) return;
    const t = setInterval(() => {
      setCountdown((c) => (c > 0 ? c - 1 : 0));
    }, 1000);
    return () => clearInterval(t);
  }, [autoRefresh]);

  // --- Helper Functions for Rendering ---

  // Formats delay string and handles "On Time"
  const formatDelay = (delay: string): string => {
    if (!delay || delay.trim() === "N/A" || delay.trim() === "0mins") {
      return "On Time";
    }
    return delay;
  };

  // Gets conditional color class for delay
  const getDelayClass = (delay: string): string => {
    const formattedDelay = formatDelay(delay);
    if (formattedDelay === "On Time") {
      return "text-green-400";
    }
    if (formattedDelay.includes("hrs")) {
      return "text-red-400";
    }
    return "text-yellow-400";
  };

  // Formats time strings to be cleaner
  const formatTime = (time: string): string => {
    if (time === "N/A" || !time) return "—";
    if (time === "SOURCE") return "Source";
    if (time === "DEST") return "Dest.";
    return time;
  };

  // --- Main Render Function ---

  const progressPercent = data?.progressPercent ?? 0;

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-white-400">
           Train Tracker
        </h1>

        {/* Input Form */}
        <form
          onSubmit={fetchStatus}
          className="flex justify-center mb-6 gap-2"
        >
          <Input type="text" placeholder="Enter Train Number" className="p-3 r  max-w-xs" value={train}
            onChange={(e) => setTrain(e.target.value)}/>
          
          <Button type="submit" variant="default" disabled={loading} className="dark">
        
        {loading ? "Fetching..." : "Get Status"}
      </Button>
          
        </form>

        {/* Content Area */}
        <div className="mt-8">
          {loading && (
            <div className="text-center p-10 text-xl text-gray-400">
              Loading status...
            </div>
          )}

          {data?.error && (
            <div className="text-red-400 text-center text-lg p-10">
              {data.error}
            </div>
          )}

          {!loading && !data && (
            <div className="text-center p-10 text-gray-500">
              Enter a train number to track its status.
            </div>
          )}

          {data?.stations && (
            <div className="bg-gray-900 p-4 md:p-6 rounded-lg shadow-lg">
              {/* Card Header */}
              <div className="flex flex-col md:flex-row justify-between md:items-center mb-4">
                <div>
                  <h2 className="text-2xl font-semibold text-blue-300">
                    {data.trainName} ({data.trainNumber})
                  </h2>
                  
                </div>
                <button
                  onClick={() => setAutoRefresh((a) => !a)}
                  className={`mt-3 md:mt-0 px-4 py-2 rounded ${
                    autoRefresh
                      ? "bg-green-700 hover:bg-green-800"
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
                >
                  {autoRefresh ? `Auto-Refresh: ${countdown}s` : "Enable Live"}
                </button>
              </div>

              {/* Progress bar */}
              <div className="mb-6">
                <div className="w-full bg-gray-700 h-3 rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full bg-green-500 transition-all duration-700"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
                <p className="text-xs text-center text-gray-400">
                  Journey progress: {progressPercent}%
                </p>
              </div>

              {/* --- DESKTOP TABLE (Hidden on Mobile) --- */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-800 uppercase text-left">
                      <th className="p-3">Station</th>
                      <th className="p-3">Arrival</th>
                      <th className="p-3">Departure</th>
                      <th className="p-3">Delay</th>
                      <th className="p-3">Platform</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.stations.map((s: Station, i: number) => (
                      <tr
                        key={i}
                        className={`border-b border-gray-800 ${
                          s.isCurrent
                            ? "bg-green-900 text-white font-semibold"
                            : "bg-gray-850"
                        }`}
                      >
                        <td className="p-3 align-top">{s.station}</td>
                        <td className="p-3 align-top">
                          <span className="block text-gray-400 line-through">
                            {formatTime(s.arrival.scheduled)}
                          </span>
                          <span className="block font-medium">
                            {formatTime(s.arrival.actual)}
                          </span>
                        </td>
                        <td className="p-3 align-top">
                          <span className="block text-gray-400 line-through">
                            {formatTime(s.departure.scheduled)}
                          </span>
                          <span className="block font-medium">
                            {formatTime(s.departure.actual)}
                          </span>
                        </td>
                        <td
                          className={`p-3 align-top font-medium ${getDelayClass(
                            s.delay
                          )}`}
                        >
                          {formatDelay(s.delay)}
                        </td>
                        <td className="p-3 align-top">{s.platform || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* --- MOBILE CARD LIST (Hidden on Desktop) --- */}
              <div className="md:hidden space-y-4">
                {data.stations.map((s: Station, i: number) => (
                  <div
                    key={i}
                    className={`p-4 rounded-lg ${
                      s.isCurrent
                        ? "bg-green-900 border border-green-600"
                        : "bg-gray-800"
                    }`}
                  >
                    <h3 className="font-bold text-lg">
                      {s.station}
                      {s.isCurrent && (
                        <span className="text-xs align-top bg-green-600 text-white px-2 py-1 rounded-full ml-2">
                          CURRENT
                        </span>
                      )}
                    </h3>

                    <div className="grid grid-cols-2 gap-4 mt-3">
                      {/* Arrival */}
                      <div>
                        <span className="text-xs text-gray-400">Arrival</span>
                        <span className="block text-gray-400 line-through">
                          {formatTime(s.arrival.scheduled)}
                        </span>
                        <span className="block font-medium">
                          {formatTime(s.arrival.actual)}
                        </span>
                      </div>
                      {/* Departure */}
                      <div>
                        <span className="text-xs text-gray-400">Departure</span>
                        <span className="block text-gray-400 line-through">
                          {formatTime(s.departure.scheduled)}
                        </span>
                        <span className="block font-medium">
                          {formatTime(s.departure.actual)}
                        </span>
                      </div>
                      {/* Delay */}
                      <div>
                        <span className="text-xs text-gray-400">Delay</span>
                        <span
                          className={`block font-medium ${getDelayClass(
                            s.delay
                          )}`}
                        >
                          {formatDelay(s.delay)}
                        </span>
                      </div>
                      {/* Platform */}
                      <div>
                        <span className="text-xs text-gray-400">Platform</span>
                        <span className="block font-medium">
                          {s.platform || "—"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}