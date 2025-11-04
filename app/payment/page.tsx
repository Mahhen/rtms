// app/payment/page.tsx
"use client";

import React, { useState, useMemo , useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm'
import PayButton from './PayButton';
import { CheckoutProvider } from "@stripe/react-stripe-js/checkout";




const BASE_FARE_PER_KM = 0.5;
const TIER_MULTIPLIERS: Record<string, number> = { "1AC": 3.0, "2AC": 2.0, "3AC": 1.5, Sleeper: 1.0 };
const stripe = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);


export default function PaymentPage() {

  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    const handlePayAndBook = async () => {
      setStatus("processing");

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication error. Please log in again.");
        setStatus("failure");
        return;
      }
      // --- Map passengers to seats ---
      const seatsPayload = bookingDetails.selectedSeats.map((seatNum, idx) => ({
        seat_number: seatNum,
        passenger: bookingDetails.passengers[idx],
      }));

      const payload = {
        train_no: bookingDetails.trainNumber,
        journey_date: bookingDetails.journeyDate,
        src: bookingDetails.src,
        dest: bookingDetails.dest,
        class_name: bookingDetails.selectedTier,
        coach_name: bookingDetails.selectedCoach,
        total_fare: totalFare,
        seats: seatsPayload,
        seat_type: "default",
      };

      try {
        const res = await fetch("/api/payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        //if (!res.ok || !data.success) throw new Error(data.error || "Booking failed.");
        setClientSecret(data.clientSecret);
      } catch (err: any) {
        setError(err.message);
        setStatus("failure");
    }
  };
      handlePayAndBook();
  }, []);

  const router = useRouter();

  const searchParams = useSearchParams();

  const bookingDetails = useMemo(() => {
    const passengersStr = searchParams.get("passengers");
    return {
      trainNumber: searchParams.get("trainNumber")!,
      journeyDate: searchParams.get("journeyDate")!,
      src: searchParams.get("src")!,
      dest: searchParams.get("dest")!,
      distance: Number(searchParams.get("distance")),
      selectedTier: searchParams.get("selectedTier")!,
      selectedCoach: searchParams.get("selectedCoach")!,
      selectedSeats: searchParams.get("selectedSeats")?.split(",") || [],
      passengers: passengersStr ? JSON.parse(passengersStr) : [],
    };
  }, [searchParams]);

  const [status, setStatus] = useState<"idle" | "processing" | "success" | "failure">("idle");
  const [error, setError] = useState("");
  const [pnr, setPnr] = useState("");

  const totalFare = useMemo(() => {
    const multiplier = TIER_MULTIPLIERS[bookingDetails.selectedTier] || 1;
    return bookingDetails.distance * BASE_FARE_PER_KM * multiplier * bookingDetails.selectedSeats.length;
  }, [bookingDetails]);

  if (status === "success") {
    return (
      <div className="container mx-auto p-8 text-center">
        <CheckCircle2 className="h-16 w-16 mx-auto text-green-500 mb-4" />
        <h1 className="text-3xl font-bold text-green-600">Booking Confirmed!</h1>
        <p className="text-xl mt-4">Your PNR: <strong>{pnr}</strong></p>
        <Button onClick={() => router.push("/my-bookings")} className="mt-6">View My Bookings</Button>
      </div>
    );
  }

  if (status === "failure") {
    return (
      <div className="container mx-auto p-8 text-center">
        <XCircle className="h-16 w-16 mx-auto text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-red-600">Booking Failed</h1>
        <p className="text-red-500">{error}</p>
        <Button onClick={() => setStatus("idle")} className="mt-6">Try Again</Button>
      </div>
    );
  }
  return (
    clientSecret != null ?
    <CheckoutProvider
      stripe={stripe}
      options={{clientSecret}}>
            <div className="container mx-auto p-8 max-w-2xl">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Confirm Booking</CardTitle>
                  <CardDescription>Review details and proceed to payment</CardDescription>
                </CardHeader>
                {clientSecret ? (
                  <Elements stripe={stripe} options={{ clientSecret }}>
                    <CheckoutForm />
                  </Elements>
                ) : (
                  <div>Loading payment form...</div>
                )}

                <CardContent>
                  <p><strong>Train:</strong> {bookingDetails.trainNumber}</p>
                  <p><strong>Seats:</strong> {bookingDetails.selectedSeats.join(", ")}</p>
                  <p className="text-2xl font-bold mt-4">Total Fare: ₹{totalFare.toFixed(2)}</p>
                  <PayButton />
                </CardContent>
              </Card>
            </div>
    </CheckoutProvider>
    :
    
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      <p className="mt-4 text-lg font-medium">Loading...</p>
    </div>

  );
}
