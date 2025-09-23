// app/passenger-details/page.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PassengerData {
  id: string; // Seat ID (e.g., 'UB1A')
  name: string;
  age: string; // Keep as string for form input
  gender: "Male" | "Female" | "Other" | "";
}

export default function PassengerDetailsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const bookingParams = useMemo(() => ({
    trainNumber: searchParams.get("trainNumber")!,
    journeyDate: searchParams.get("journeyDate")!,
    src: searchParams.get("src")!,
    dest: searchParams.get("dest")!,
    distance: searchParams.get("distance")!,
    selectedTier: searchParams.get("selectedTier")!,
    selectedCoach: searchParams.get("selectedCoach")!,
    selectedSeats: searchParams.get("selectedSeats")?.split(",") || [],
  }), [searchParams]);

  const [passengers, setPassengers] = useState<PassengerData[]>([]);

  useEffect(() => {
    setPassengers(
      bookingParams.selectedSeats.map((seatId) => ({
        id: seatId, name: "", age: "", gender: "",
      }))
    );
  }, [bookingParams.selectedSeats]);

  const handlePassengerChange = (seatId: string, field: keyof PassengerData, value: string) => {
    setPassengers((prev) =>
      prev.map((p) => (p.id === seatId ? { ...p, [field]: value } : p))
    );
  };

  const handleSubmit = () => {
    for (const p of passengers) {
      if (!p.name.trim() || !p.age.trim() || !p.gender) {
        alert(`Please fill all details for the passenger in seat ${p.id}.`);
        return;
      }
      if (isNaN(parseInt(p.age)) || parseInt(p.age) <= 0) {
        alert(`Please enter a valid age for the passenger in seat ${p.id}.`);
        return;
      }
    }
    const paramsToPass = new URLSearchParams({
      ...bookingParams,
      selectedSeats: bookingParams.selectedSeats.join(","),
      passengers: JSON.stringify(passengers), // Pass passenger data as a JSON string
    });
    router.push(`/payment?${paramsToPass.toString()}`);
  };

  return (
    <div className="container mx-auto p-8 max-w-3xl">
      <h1 className="text-3xl font-bold text-center mb-8">Enter Passenger Details</h1>
      {passengers.map((passenger) => (
        <Card key={passenger.id} className="mb-6">
          <CardHeader>
            <CardTitle>Passenger for Seat: <span className="text-blue-600">{passenger.id}</span></CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor={`name-${passenger.id}`}>Full Name</Label>
              <Input id={`name-${passenger.id}`} value={passenger.name} onChange={(e) => handlePassengerChange(passenger.id, "name", e.target.value)} />
            </div>
            <div>
              <Label htmlFor={`age-${passenger.id}`}>Age</Label>
              <Input id={`age-${passenger.id}`} type="number" value={passenger.age} onChange={(e) => handlePassengerChange(passenger.id, "age", e.target.value)} />
            </div>
            <div>
              <Label htmlFor={`gender-${passenger.id}`}>Gender</Label>
              <Select value={passenger.gender} onValueChange={(value) => handlePassengerChange(passenger.id, "gender", value)}>
                <SelectTrigger id={`gender-${passenger.id}`}><SelectValue placeholder="Select..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      ))}
      <div className="flex justify-end mt-8">
        <Button onClick={handleSubmit} size="lg">Proceed to Payment</Button>
      </div>
    </div>
  );
}