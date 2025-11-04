"use client";
import { useEffect, useState } from "react";

export default function TrainStatusPage() {
  const [train, setTrain] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [countdown, setCountdown] = useState(60);

  async function fetchStatus() {
    if (!train.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/train-status?train=${train}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
      setData({ error: "Failed to fetch data" });
    } finally {
      setLoading(false);
    }
  }

  // auto refresh every 60 sec
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchStatus();
      setCountdown(60);
    }, 60000);
    return () => clearInterval(interval);
  }, [autoRefresh, train]);

  // countdown
  useEffect(() => {
    if (!autoRefresh) return;
    const t = setInterval(() => {
      setCountdown((c) => (c > 0 ? c - 1 : 0));
    }, 1000);
    return () => clearInterval(t);
  }, [autoRefresh]);

  const progressPercent = data?.progressPercent ?? 0;

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-400">
        🚆 Live Train Tracker
      </h1>

      <div className="flex justify-center mb-6 gap-2">
        <input
          type="text"
          placeholder="Enter Train Number (e.g. 18189)"
          value={train}
          onChange={(e) => setTrain(e.target.value)}
          className="p-2 rounded text-black w-64"
        />
        <button
          onClick={fetchStatus}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
        >
          {loading ? "Fetching..." : "Get Status"}
        </button>
        {data && (
          <button
            onClick={() => setAutoRefresh((a) => !a)}
            className={`${
              autoRefresh ? "bg-green-700" : "bg-gray-700"
            } px-4 py-2 rounded`}
          >
            {autoRefresh ? `Auto: ${countdown}s` : "Enable Live"}
          </button>
        )}
      </div>

      {data?.error && (
        <div className="text-red-400 text-center">{data.error}</div>
      )}

      {data?.stations && (
        <div className="bg-gray-900 p-5 rounded-lg shadow-lg max-w-5xl mx-auto">
          <div className="mb-4">
            <h2 className="text-2xl font-semibold text-blue-300">
              {data.trainName} ({data.trainNumber})
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              {data.currentPosition} | Delay: {data.overallDelay} | Updated:{" "}
              {data.lastUpdated}
            </p>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-700 h-3 rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-green-500 transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <p className="text-xs text-center text-gray-400 mb-6">
            Journey progress: {progressPercent}%
          </p>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-800 uppercase">
                  <th className="p-2">Station</th>
                  <th className="p-2">Arr (Sch/Act)</th>
                  <th className="p-2">Dep (Sch/Act)</th>
                  <th className="p-2">Delay</th>
                  <th className="p-2">Platform</th>
                </tr>
              </thead>
              <tbody>
                {data.stations.map((s: any, i: number) => (
                  <tr
                    key={i}
                    className={`border-b border-gray-800 ${
                      s.isCurrent
                        ? "bg-green-900 text-white font-semibold"
                        : i % 2 === 0
                        ? "bg-gray-900"
                        : "bg-gray-850"
                    }`}
                  >
                    <td className="p-2">{s.station}</td>
                    <td className="p-2">
                      {s.arrival.scheduled} → {s.arrival.actual}
                    </td>
                    <td className="p-2">
                      {s.departure.scheduled} → {s.departure.actual}
                    </td>
                    <td className="p-2 text-yellow-400">{s.delay}</td>
                    <td className="p-2">{s.platform}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
