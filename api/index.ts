import { Station, StationSearchResponse } from "@/types";
import data from "@/components/data/stations.json";

// for testing; todo: remove
const mockDelay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const searchStation = async (query: string) => {
  await mockDelay(0); // testing todo: remove on prod

  // Filter stations.json by query
  const filtered = (data as Station[]).filter((station) =>
    station.stationName.toLowerCase().includes(query.toLowerCase()) ||
    station.stationId.toLowerCase().includes(query.toLowerCase())
  );

  const response: StationSearchResponse = {
    stations: filtered,
  };

  return response;
};
