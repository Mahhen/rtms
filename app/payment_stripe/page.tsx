"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function PaymentProcessing() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    async function handleSuccesfullPayment() {
      const paymentIntent = searchParams.get("payment_intent");
      const paymentIntentClientSecret = searchParams.get("payment_intent_client_secret");

      if (!paymentIntent || !paymentIntentClientSecret) {
        router.push("/");
        return;
      }

      try {
        const response = await fetch("/api/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentIntent,
            paymentIntentClientSecret,
          }),
        });

        if (response.ok) {
          const responseBody = await response.json();
          router.replace(`/booking-done?pnr=${responseBody.pnr}`)
        } else {
            toast("Encountered an error with booking process.")
            router.replace("/")
          console.error("Failed to process booking");
        }
      } catch (error) {
        toast("Encountered an error with booking process.")
        console.error("Error processing payment:", error);
      }
    }

    handleSuccesfullPayment();
  }, [router, searchParams]);

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-lg font-medium">Processing your payment...</p>
      </div>
    );
}
