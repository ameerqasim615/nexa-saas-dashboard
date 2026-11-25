import { Schema, models, model } from "mongoose";
const AdminSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true }
}, { timestamps: true });
export default models.Admin || model("Admin", AdminSchema);
