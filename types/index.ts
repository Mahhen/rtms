export interface Station {
    stationName: string;
    stationId: string;
}

export interface StationSearchResponse {
    stations: Station[];
}