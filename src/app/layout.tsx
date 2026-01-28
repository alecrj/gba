import type { Metadata } from "next";
import { Press_Start_2P } from "next/font/google";
import "./globals.css";

const pixelFont = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
});

export const metadata: Metadata = {
  title: "ALEC.dev | Developer Portfolio",
  description:
    "Web and mobile developer crafting clean, performant digital experiences.",
  keywords: ["web developer", "mobile developer", "React", "Next.js", "portfolio"],
  authors: [{ name: "Alec" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={pixelFont.variable}>{children}</body>
    </html>
  );
}
