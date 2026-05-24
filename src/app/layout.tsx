import type { Metadata } from "next";
import "./globals.css";


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

      <html lang="en">

        <body>
          {children}
        </body>

      </html>

  );
}