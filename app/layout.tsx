import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Nexa — SaaS Admin Dashboard", description: "A modern full-stack SaaS admin dashboard portfolio project." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
