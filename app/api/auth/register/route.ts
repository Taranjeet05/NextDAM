import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    //validation
    if (!email || !password)
      return NextResponse.json(
        {
          error: "email and password is required",
        },
        { status: 400 }
      );
    // check for Db connection
    await connectToDatabase();
    // check for existing User
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return NextResponse.json(
        { error: "User already register with this email" },
        { status: 400 }
      );
    // create User
    const newUser = await User.create({
      email,
      password,
    });

    // Created - return success message
    return NextResponse.json(
      { message: "Successfully registered", newUser },
      { status: 200 }
    );
  } catch (error) {
    console.log("Registration error", error);
    return NextResponse.json({ error: "Failed to register" }, { status: 500 });
  }
}
