import type { Metadata } from "next";
import "./globals.css";

import Pet from "@/components/pet/Pet";
import { PetProvider } from "@/context/PetContext";

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
        <PetProvider>
          {children}
          <Pet />
        </PetProvider>
      </body>
    </html>
  );
}
