// app/my-bookings/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertCircle, SearchX, Train, Ticket, Users, ArrowRight } from "lucide-react";

// Define the structure of a booking object for TypeScript
interface IBooking {
  pnr: string;
  train_no: string;
  journey_date: string; // Comes as string from API
  src: string;
  dest: string;
  fare: number;
  class_name: string;
  coach_name: string;
  passengers: {
    name: string;
    age: number;
    gender: string;
    seat_number: string;
  }[];
  bookingStatus: "CONFIRMED" | "CANCELLED";
  createdAt: string;
}

export default function MyBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        // The browser automatically sends the session cookie with this request
        const res = await fetch("/api/my-bookings");
        
        if (!res.ok) {
          // If the server responds with an error (like 401 Unauthorized), handle it
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to load bookings.");
        }
        
        const data = await res.json();
        if (data.success) {
          setBookings(data.bookings);
        } else {
            throw new Error(data.error || "An unknown error occurred.");
        }
      } catch (err: any) {
        console.error("Client-side error fetching bookings:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []); // Empty dependency array means this runs once on component mount

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-80px)]">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
        <p className="mt-4 text-lg text-gray-600">Loading your bookings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-8 text-center">
        <Card className="max-w-md mx-auto bg-red-50 border-red-200">
            <CardHeader>
                <CardTitle className="text-red-700 flex items-center justify-center gap-2">
                    <AlertCircle /> An Error Occurred
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={() => window.location.reload()}>Try Again</Button>
            </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4 md:p-8 max-w-5xl">
      <div className="flex items-center gap-4 mb-8">
        <Ticket className="h-10 w-10 text-blue-600"/>
        <h1 className="text-4xl font-bold text-gray-800">My Bookings</h1>
      </div>

      {bookings.length === 0 ? (
        <Card className="text-center p-8 border-dashed">
            <CardHeader>
                <SearchX className="h-16 w-16 mx-auto text-gray-400 mb-4"/>
                <CardTitle className="text-2xl text-gray-700">No Bookings Found</CardTitle>
                <CardDescription className="mt-2">
                    You haven't booked any tickets yet. Let's find a train for you!
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Button onClick={() => router.push("/")}>Book a Ticket</Button>
            </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <Card key={booking.pnr} className="shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
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
                    <p><strong>Fare:</strong> ₹{booking.fare.toFixed(2)}</p>
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
                            {booking.passengers.map((p, index) => (
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
          ))}
        </div>
      )}
    </div>
  );
}