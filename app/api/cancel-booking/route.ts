import {NextRequest, NextResponse} from "next/server";
import dbConnect from "@/lib/dbConnect";
import {getUserIdFromRequest} from "@/lib/auth";
import Booking from "@/models/booking";

export async function POST(req: NextRequest) {
    try {
        const {pnr} = await req.json();
        await dbConnect();

        const userId = await getUserIdFromRequest(req);
        if (!userId) {
            return NextResponse.json({success: false, error: "Unauthorized"}, {status: 401});
        }

        const bookings = await Booking.deleteOne({userId: userId, pnr: pnr})

        return NextResponse.json({success: true, bookings});

    } catch (error: any) {
        console.error("Failed to delete booking:", error);
        return NextResponse.json({success: false, error: "Server Error"}, {status: 500});
    }
}