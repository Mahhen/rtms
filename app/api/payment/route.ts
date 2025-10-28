import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil",
});

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const count = payload?.seats?.length || 1;
    const amount = Math.round(payload.total_fare * 100 * count);

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "inr",
      description: `Train ${payload.train_no}`,
      automatic_payment_methods: { enabled: true },
      metadata: {
        payload: JSON.stringify(payload)
      }
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
