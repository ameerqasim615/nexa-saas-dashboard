import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { createSession } from "@/lib/auth";
import Admin from "@/models/Admin";
import { loginSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const parsed = loginSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ message: "Please enter a valid email and password." }, { status: 400 });
    await connectDB();
    const admin = await Admin.findOne({ email: parsed.data.email.toLowerCase() });
    if (!admin || !(await bcrypt.compare(parsed.data.password, admin.passwordHash))) return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
    await createSession({ id: admin._id.toString(), email: admin.email, name: admin.name });
    return NextResponse.json({ user: { name: admin.name, email: admin.email } });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ message: "Unable to sign in. Check your database configuration." }, { status: 500 });
  }
}
