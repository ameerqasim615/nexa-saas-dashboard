import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { userSchema } from "@/lib/validators";

export async function GET(request: Request) {
  if (!(await getSession())) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim();
    const filter = q ? { $or: [{ name: { $regex: q, $options: "i" } }, { email: { $regex: q, $options: "i" } }] } : {};
    const users = await User.find(filter).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ users });
  } catch (error) { console.error(error); return NextResponse.json({ message: "Could not load users." }, { status: 500 }); }
}

export async function POST(request: Request) {
  if (!(await getSession())) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const parsed = userSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Invalid user details." }, { status: 400 });
  try {
    await connectDB();
    const user = await User.create(parsed.data);
    return NextResponse.json({ user }, { status: 201 });
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === 11000) return NextResponse.json({ message: "A user with this email already exists." }, { status: 409 });
    console.error(error); return NextResponse.json({ message: "Could not create user." }, { status: 500 });
  }
}
