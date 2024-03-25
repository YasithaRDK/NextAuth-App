import connection from "@/utils/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  const { name, email, password } = await request.json();

  try {
    await connection();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new NextResponse("Email is already in use", { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 5);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    return new NextResponse("user is registered", { status: 200 });
  } catch (err) {
    return new NextResponse(err, {
      status: 500,
    });
  }
};
