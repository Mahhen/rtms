import axios from "axios";
import { stat } from "fs";
import {number, string} from "zod";

export interface TrainScheduleData {
  trainNumber: number;
  trainName: string;
  origin: string;
  destination: string;
  originCode: string;
  destinationCode: string;
  departs: string;
  departCode: string;
  arrivesAt: string;
  arrivalCode: string
  distance: number;
  arrivalTime: string;
  departureTime: string;
  travelDuration: string;
  runningstatus: string;
}

const refineTrainRunningStatus = (status: string) => {
  const statusArr = status.split("");
  const sunStatus = statusArr.pop();
  statusArr.unshift(sunStatus!);
  return statusArr.join("");
}

export async function fetchTrains(boardingCode: string, destinationCode: string): Promise<TrainScheduleData[] | null> {
  try {
    const url = `https://erail.in/rail/getTrains.aspx?Station_From=${boardingCode}&Station_To=${destinationCode}&DataSource=0&Language=0&Cache=true`;
    const response = await axios.get(url);

    const text = response.data;

    // Split into train entries using '^'
    const entries = text.split("^");
    const trains = [];

    for (const entry of entries) {
      const fields = entry.split("~");
      if (fields.length > 1 && fields[0].trim()) {
        const train = {
          trainNumber: fields[0],
          trainName: fields[1],
          origin: fields[2],
          originCode: fields[3],
          destination: fields[4],
          destinationCode: fields[5],
          departs: fields[6],
          departCode: fields[7],
          arrivesAt: fields[8],
          arrivalCode: fields[9],
          distance: fields[39],
          arrivalTime: fields[11],
          departureTime: fields[10],
          travelDuration: fields[12],
          runningstatus: refineTrainRunningStatus(fields[13])
        };
        trains.push(train);
      }
    }

    return trains;
  } catch (err) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    console.error("Error fetching trains:", err.message);
    return null;
  }
}


