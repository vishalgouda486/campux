import type { Metadata } from "next";
import "./globals.css";

import {
  ClerkProvider,
} from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Campux",
  description: "Modern College ERP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>

      <html lang="en">

        <body>
          {children}
        </body>

      </html>

    </ClerkProvider>
  );
}