// app/pnr-status/page.tsx
"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Train, ArrowRight, Users, Ticket } from 'lucide-react';
import { Badge } from '@/components/ui/badge'; // Assuming you have the Badge component

const PNRStatusPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const bookingData = searchParams.get('booking');

    if (!bookingData) {
        return (
            <div className="container mx-auto p-8 text-center">
                <Card className="max-w-md mx-auto">
                    <CardHeader>
                        <CardTitle className="text-red-600">No Booking Data</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>No booking information was provided. Please go back and look up a PNR again.</p>
                        <Button onClick={() => router.push('/')} className="mt-4">Go Home</Button>
                    </CardContent>
                </Card>
            </div>
        );
    }
    
    try {
        const booking = JSON.parse(bookingData);

        return (
            <div className="container mx-auto p-4 md:p-8 max-w-2xl">
                <div className="flex items-center gap-4 mb-8">
                    <Ticket className="h-10 w-10 text-blue-600"/>
                    <h1 className="text-4xl font-bold text-gray-800">PNR Status</h1>
                </div>
                <Card className="shadow-lg">
                    <CardHeader className="bg-gray-50 p-4 border-b flex flex-row justify-between items-center">
                        <div>
                            <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                                <Train className="h-5 w-5 text-gray-600"/> Train No: {booking.train_no}
                            </CardTitle>
                            <CardDescription className="text-sm mt-1">
                                Booked on: {new Date(booking.createdAt).toLocaleString()}
                            </CardDescription>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-medium text-gray-500">PNR</p>
                            <p className="text-lg font-bold text-blue-600 tracking-wider">{booking.pnr}</p>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-700">
                        <div className="md:col-span-1 space-y-3">
                            <h4 className="font-semibold text-gray-800">Journey Details</h4>
                            <p className="font-bold text-lg flex items-center gap-2">
                                {booking.src} <ArrowRight className="h-5 w-5"/> {booking.dest}
                            </p>
                            <p><strong>Date:</strong> {new Date(booking.journey_date).toDateString()}</p>
                            <p><strong>Class:</strong> {booking.class_name} ({booking.coach_name})</p>
                            <Badge variant={booking.bookingStatus === "CONFIRMED" ? "default" : "destructive"}>
                                {booking.bookingStatus}
                            </Badge>
                        </div>
                        <div className="md:col-span-2 space-y-3">
                            <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                                <Users className="h-5 w-5"/> Passengers ({booking.passengers.length})
                            </h4>
                            <div className="border rounded-lg p-3 bg-gray-50 max-h-40 overflow-y-auto">
                                <ul className="space-y-2 text-sm">
                                    {booking.passengers.map((p: any, index: number) => (
                                    <li key={index} className="flex justify-between">
                                        <span>{index + 1}. {p.name} ({p.age}, {p.gender.charAt(0)})</span>
                                        <span className="font-medium">Seat: {p.seat_number}</span>
                                    </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    } catch (e) {
        // Handle JSON parsing error
        return (
            <div className="container mx-auto p-8 text-center text-red-600">
                Invalid booking data format.
            </div>
        );
    }
};

export default PNRStatusPage;