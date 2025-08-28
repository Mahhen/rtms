"use client"

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {fetchTrains, TrainScheduleData} from "@/api/traindet";
import IRLogo from "@/components/ir-logo";

export default function TrainSearchResults() {
    const [loading, setLoading] = useState(true);
    const [isError, setError] = useState(false);
    const [trains, setTrains] = useState<TrainScheduleData[]>([]);

    useEffect(() => {
        (async () =>{
            const trainData = await fetchTrains("NLR", "KTYM");
            if (trainData) setTrains(trainData);
            else setError(true);
            setLoading(false);
        })()
    }, []);

    const prettifiedDuration = (duration: string): string => {
        const data =  duration.split(".");
        const hr = Number(data[0]);
        const min = Number(data[1]);
        return `${hr} h ${min} min`
    }

    return (
        <div className="bg-[#f6f6f6]">
            <div className="p-6 w-[500px] space-y-1 pb-10">
                <div className="flex items-center justify-between border rounded-xl p-4 bg-card">
                    <div>
                        <p className="text-sm text-muted-foreground">From</p>
                        <p className="text-lg font-semibold">NLR///Nellore</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">To</p>
                        <p className="text-lg font-semibold">KTYM///Kottayam</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Date</p>
                        <p className="text-lg font-semibold">BITCH</p>
                    </div>
                    <div>
                        <Button variant="outline">Settings</Button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="animate-spin w-8 h-8 text-muted-foreground" />
                    </div>
                ) : (
                    <div className="grid gap-1">
                        {trains.map((train) => (
                            <Card key={train.trainNumber} className="rounded-[5px] border shadow-sm hover:shadow-xl border-solid p-0">
                                <CardContent className="p-3 flex flex-col items-start min-w-[60px]">
                                    <div className="flex flex-row place-items-center">
                                        <div>
                                            <IRLogo />
                                        </div>
                                        <div className="ml-4">
                                            <div className="border-[1px] border-red-500 border-solid rounded-xs ml-[-10] text-sm font-semibold text-red-500">
                                                <div className="mx-1">
                                                    {train.trainNumber}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-xs ml-2 place-self-center">
                                            {train.trainName}
                                        </div>
                                    </div>
                                    <div className="mt-2 flex flex-row place-items-center w-full">
                                        <div className="text-sm font-semibold">
                                            {train.departureTime}
                                        </div>
                                        <div className="col-span-4 w-full mx-5">
                                            <div className="flex items-center">
                                                <div className="h-2 w-2 rounded-full bg-black" />
                                                <div className="w-full h-[1px] bg-black relative"/>
                                                <div className="h-2 w-2 rounded-full bg-black" />
                                            </div>
                                        </div>
                                        <div className="ml-auto text-sm font-semibold">
                                            {train.arrivalTime}
                                        </div>
                                    </div>
                                    <div className="flex flex-row mt-2 place-items-center w-full">
                                        <div className="text-sm">
                                            Pl. 2
                                        </div>
                                        <div className="grow">

                                        </div>
                                        <div className="text-sm">
                                            {prettifiedDuration(train.travelDuration)}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
