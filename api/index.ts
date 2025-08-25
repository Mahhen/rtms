import {Station} from "@/types";
import {StationSearchResponse} from "@/types";


// for testing; todo: remove
const mockDelay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms))

export const searchStation = async (query: string) => {
    await mockDelay(1500); // testing todo: remove on prod
    // todo: implement function
    const testData: Station[] = [
        {stationId: "t1", stationName: "test1"},
        {stationId: "t2", stationName: "test2"},
        {stationId: "t3", stationName: "test3"},
        {stationId: "t4", stationName: "test4"},
        {stationId: "t5", stationName: "test5"},
        {stationId: "t6", stationName: "test6"},
        {stationId: "t7", stationName: "test7"},
        {stationId: "t8", stationName: "test8"},
        {stationId: "t9", stationName: "test9"},
        {stationId: "t10", stationName: "test10"},
    ]
    const response: StationSearchResponse = {
        stations: testData,
    }
    return response;
}
