"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentSuccessPage() {
  
  const router = useRouter();
  const searchParams = useSearchParams();

  // Optional: capture PNR or transaction ID from URL
  const pnr = searchParams.get("pnr") || "NA";
  const amount = searchParams.get("amount");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8">
      <div className="bg-white shadow-lg rounded-2xl p-10 text-center max-w-md w-full">
        <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-green-600 mb-2">
          Payment Successful!
        </h1>
        <p className="text-gray-700 mb-4">
          Thank you for your payment. Your booking has been confirmed.
        </p>

        {pnr !== "NA" && (
          <p className="text-lg mb-2">
            <strong>PNR:</strong> {pnr}
          </p>
        )}

        {amount && (
          <p className="text-lg mb-6">
            <strong>Amount Paid:</strong> ₹{amount}
          </p>
        )}

        <div className="flex flex-col gap-3">
          <Button
            onClick={() => router.push("/my-bookings")}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            View Ticket
          </Button>

          <Button
            onClick={() => router.push("/")}
            variant="outline"
            className="w-full"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
