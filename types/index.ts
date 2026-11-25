export type AppUser = { _id: string; name: string; email: string; role: "Admin" | "Editor" | "Member"; status: "Active" | "Pending" | "Inactive"; createdAt?: string };
