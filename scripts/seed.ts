import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Admin from "../models/Admin";
import User from "../models/User";

async function seed() {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is missing. Copy .env.example to .env.local first.");
  await mongoose.connect(process.env.MONGODB_URI);
  const email = (process.env.ADMIN_EMAIL || "admin@nexa-demo.com").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "ChangeMe123!";
  const passwordHash = await bcrypt.hash(password, 12);
  await Admin.findOneAndUpdate({ email }, { name: process.env.ADMIN_NAME || "Ameer Qasim", email, passwordHash }, { upsert: true, new: true });
  const count = await User.countDocuments();
  if (count === 0) await User.insertMany([
    { name: "Olivia Rhye", email: "olivia@example.com", role: "Admin", status: "Active" },
    { name: "Phoenix Baker", email: "phoenix@example.com", role: "Editor", status: "Active" },
    { name: "Lana Steiner", email: "lana@example.com", role: "Member", status: "Pending" },
    { name: "Demi Wilkinson", email: "demi@example.com", role: "Member", status: "Active" },
    { name: "Candice Wu", email: "candice@example.com", role: "Editor", status: "Inactive" },
    { name: "Natali Craig", email: "natali@example.com", role: "Member", status: "Active" }
  ]);
  console.log(`Seed complete. Admin login: ${email} / ${password}`);
  await mongoose.disconnect();
}
seed().catch(async (error) => { console.error(error); await mongoose.disconnect(); process.exit(1); });
