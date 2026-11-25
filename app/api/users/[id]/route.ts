import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { userSchema } from "@/lib/validators";

type Context = { params: Promise<{ id: string }> };
export async function PATCH(request: Request, context: Context) {
  if (!(await getSession())) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const { id } = await context.params;
  if (!mongoose.isValidObjectId(id)) return NextResponse.json({ message: "Invalid user ID." }, { status: 400 });
  const parsed = userSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Invalid user details." }, { status: 400 });
  try {
    await connectDB();
    const user = await User.findByIdAndUpdate(id, parsed.data, { new: true, runValidators: true });
    if (!user) return NextResponse.json({ message: "User not found." }, { status: 404 });
    return NextResponse.json({ user });
  } catch (error) { console.error(error); return NextResponse.json({ message: "Could not update user." }, { status: 500 }); }
}
export async function DELETE(_request: Request, context: Context) {
  if (!(await getSession())) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const { id } = await context.params;
  if (!mongoose.isValidObjectId(id)) return NextResponse.json({ message: "Invalid user ID." }, { status: 400 });
  try {
    await connectDB();
    const user = await User.findByIdAndDelete(id);
    if (!user) return NextResponse.json({ message: "User not found." }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) { console.error(error); return NextResponse.json({ message: "Could not delete user." }, { status: 500 }); }
}
