import type { Metadata } from "next";
import "./globals.css";
import Pet from "@/components/pet/Pet";

export const metadata: Metadata = {
  title: "ZenithAI",
  description: "AI-powered clarity for the modern mind",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Pet />
      </body>
    </html>
  );
}
