import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BrainReef - Student Resource Hub",
  description: "Your ultimate destination for study materials, notes, question papers, and MCQ practice tests. Access comprehensive resources for all branches and semesters.",
  keywords: "study materials, notes, question papers, MCQ, engineering resources, VTU exams",
  authors: [{ name: "BrainReef" }],
  openGraph: {
    title: "BrainReef - Student Resource Hub",
    description: "Your ultimate destination for study materials, notes, question papers, and MCQ practice tests.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
