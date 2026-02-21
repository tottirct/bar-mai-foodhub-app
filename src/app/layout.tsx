// src/app/layout.tsx
import "./globals.css";
import { Prompt } from "next/font/google";
import { Inter } from "next/font/google";

const prompt = Prompt({
    weight: ["300", "400", "500", "600", "700"],
    subsets: ["latin", "thai"],
    display: "swap",
    variable: "--font-prompt",
});

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-inter",
});

export const metadata = {
    title: "บาร์ใหม่ FoodHub",
    description: "ระบบสั่งอาหารโรงอาหารบาร์ใหม่",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="th" className={`${prompt.variable} ${inter.variable}`}>
            <body className="font-prompt bg-gray-50 text-gray-900 antialiased">
                {children}
            </body>
        </html>
    );
}