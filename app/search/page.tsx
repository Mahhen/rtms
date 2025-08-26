"use client"

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function TrainSearchResults() {
    const [loading, setLoading] = useState(true);
    const [trains, setTrains] = useState<any[]>([]);

    // mock API call
    useEffect(() => {
        setTimeout(() => {
            setTrains([
                {
                    id: 1,
                    name: "IR 95",
                    direction: "Genève-Aéroport",
                    departure: "22:27",
                    arrival: "23:40",
                    duration: "1 h 13 min",
                    price2: "CHF 16.00",
                    price1: "CHF 18.20",
                    platform: "1",
                },
                {
                    id: 2,
                    name: "EC",
                    direction: "Genève",
                    departure: "22:53",
                    arrival: "00:05",
                    duration: "1 h 12 min",
                    price2: "CHF 16.00",
                    price1: "CHF 18.20",
                    platform: "1",
                },
                {
                    id: 3,
                    name: "IR 95",
                    direction: "Genève",
                    departure: "23:31",
                    arrival: "00:38",
                    duration: "1 h 7 min",
                    price2: "CHF 16.00",
                    price1: "CHF 18.20",
                    platform: "1",
                }
            ]);
            setLoading(false);
        }, 1200);
    }, []);

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-4">
            <div className="flex items-center justify-between border rounded-xl p-4 bg-card">
                <div>
                    <p className="text-sm text-muted-foreground">From</p>
                    <p className="text-lg font-semibold">Montreux</p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">To</p>
                    <p className="text-lg font-semibold">Genève</p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="text-lg font-semibold">Su, 24.08.2025</p>
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
                <div className="grid gap-4">
                    {trains.map((train) => (
                        <Card key={train.id} className="rounded-2xl border shadow-sm">
                            <CardContent className="p-4 grid grid-cols-6 items-center">
                                <div className="col-span-2">
                                    <p className="font-bold text-lg">{train.departure} → {train.arrival}</p>
                                    <p className="text-sm text-muted-foreground">{train.duration}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="font-medium">{train.name} {train.direction}</p>
                                    <p className="text-sm text-muted-foreground">Platform {train.platform}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm">2nd class</p>
                                    <p className="font-semibold">{train.price2}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm">1st class</p>
                                    <p className="font-semibold">{train.price1}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
