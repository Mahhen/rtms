import {NextRequest, NextResponse} from "next/server"
import dbConnect from "@/lib/dbConnect"
import {getUserIdFromRequest} from "@/lib/auth";
import mongoose from "mongoose"
import bcrypt from "bcrypt"

// Define schema (if not already defined globally)
const UserSchema = new mongoose.Schema(
    {
        user_id: String,
        user_name: String,
        user_mobile: String,
        user_email: String,
        user_address: String,
        login: {
            login_id: String,
            login_username: String,
            login_password_hash: String,
            role: {
                role_id: String,
                role_name: String,
                role_desc: String,
            },
        },
        permission: {
            per_id: String,
            name_of_official: String,
        },
    },
    { collection: "users" }
)

const User = mongoose.models.User || mongoose.model("User", UserSchema)

// ✅ GET Profile
export async function GET(req: NextRequest) {
    try {
        await dbConnect()
        const userId = await getUserIdFromRequest(req)
        console.log("user id", userId)
        if (!userId)
            return NextResponse.json({ error: "Missing email" }, { status: 400 })

        const user = await User.findOne({ _id: userId }).lean()
        if (!user)
            return NextResponse.json({ error: "User not found" }, { status: 404 })

        return NextResponse.json(user)
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}

// ✅ Update Profile
export async function PUT(req: Request) {
    try {
        await dbConnect()
        const body = await req.json()
        const { user_id, user_name, user_mobile, user_email, user_address } = body

        await User.updateOne(
            { user_id },
            {
                $set: {
                    user_name,
                    user_mobile,
                    user_email,
                    user_address,
                },
            }
        )

        return NextResponse.json({ success: true })
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}

// ✅ Change Password
export async function PATCH(req: Request) {
    try {
        await dbConnect()
        const body = await req.json()
        const { user_id, oldPassword, newPassword } = body

        const user: any = await User.findOne({ user_id })
        if (!user)
            return NextResponse.json({ error: "User not found" }, { status: 404 })

        const match = await bcrypt.compare(
            oldPassword,
            user.login.login_password_hash
        )
        if (!match)
            return NextResponse.json(
                { error: "Old password incorrect" },
                { status: 400 }
            )

        const hash = await bcrypt.hash(newPassword, 10)

        await User.updateOne(
            { user_id },
            { $set: { "login.login_password_hash": hash } }
        )

        return NextResponse.json({ success: true })
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}