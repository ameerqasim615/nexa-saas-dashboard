import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  try {
    await connectDB();
    const [totalUsers, activeUsers, pendingUsers, recentUsers] = await Promise.all([
      User.countDocuments(), User.countDocuments({ status: "Active" }), User.countDocuments({ status: "Pending" }),
      User.find().sort({ createdAt: -1 }).limit(5).select("name email role status createdAt").lean()
    ]);
    return NextResponse.json({ stats: { totalUsers, activeUsers, pendingUsers, monthlyRevenue: 24850, revenueChange: 12.8, userChange: 8.2 }, recentUsers });
  } catch (error) { console.error("Dashboard error:", error); return NextResponse.json({ message: "Could not load dashboard." }, { status: 500 }); }
}
