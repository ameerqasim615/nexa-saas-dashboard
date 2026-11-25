import mongoose, { Schema, models, model } from "mongoose";

const UserSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  role: { type: String, enum: ["Admin", "Editor", "Member"], default: "Member" },
  status: { type: String, enum: ["Active", "Pending", "Inactive"], default: "Active" },
  avatarColor: { type: String, default: "#e8edff" }
}, { timestamps: true });

export type UserDocument = mongoose.InferSchemaType<typeof UserSchema> & { _id: mongoose.Types.ObjectId };
export default models.User || model("User", UserSchema);
