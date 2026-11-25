import { z } from "zod";
export const userSchema = z.object({
  name: z.string().trim().min(2, "Name must contain at least 2 characters.").max(80),
  email: z.string().trim().email("Enter a valid email address."),
  role: z.enum(["Admin", "Editor", "Member"]),
  status: z.enum(["Active", "Pending", "Inactive"])
});
export const loginSchema = z.object({ email: z.string().email(), password: z.string().min(8) });
