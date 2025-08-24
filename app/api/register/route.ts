import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/lib/dbConnect";
import User from "@/models/users";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  const { firstName, lastName, email, phone, password, role } = await req.json();

  try {
    await connectToDB();

    const existingUser = await User.findOne({ user_email: email });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

   const roleName = role || "user";

    const newUser = new User({
      user_id: Date.now().toString(),
      user_name: `${firstName} ${lastName}`,
      user_mobile: phone,
      user_email: email,
      user_address: "",
      login: {
        login_id: Date.now().toString(),
        login_username: email,
        login_password_hash: passwordHash,
        role: {
          role_id: roleName === "admin" ? "0" : "1",
          role_name: roleName,
          role_desc: roleName === "admin" ? "Administrator" : "Regular user",
        },
      },
      permission: { per_id: "1", name_of_official: "User Permission" },
    });

    await newUser.save();

    const token = jwt.sign(
      {
        userId: newUser._id,
        email: newUser.user_email,
        role: newUser.login.role.role_name,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    return NextResponse.json(
      { message: "User registered successfully", token },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
