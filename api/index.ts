import {Station} from "@/types";
import {StationSearchResponse} from "@/types";


// for testing; todo: remove
const mockDelay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms))

export const searchStation = async (query: string) => {
    await mockDelay(0); // testing todo: remove on prod
    // todo: implement function
    const testData: Station[] = [
        {stationId: "NLR", stationName: "Nellore"},
        {stationId: "KTYM", stationName: "Kottayam"},
    ]
    const response: StationSearchResponse = {
        stations: testData,
    }
    return response;
}
