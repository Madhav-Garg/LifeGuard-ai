import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "LifeGuard AI | Futuristic Health Intelligence",
  description: "AI-powered health intelligence with predictive insights and emergency detection."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={spaceGrotesk.variable}>
      <body className="bg-grid">
        {children}
      </body>
    </html>
  );
}
