import "./globals.css";
import Navbar from "@/components/Navbar";
import { Inter, Prompt } from "next/font/google";
import { AuthProvider } from "./Providers";

export const metadata = {
  title: "bar-mai-app",
  description: "Application for managing bar-mai",
};

const prompt = Prompt({
  subsets: ["thai", "latin"], 
  weight: ["300", "400", "500", "700"] 
});

export default function RootLayout({ children }: { children: React.ReactNode;}){
  return (
    <html lang="en" className="h-full">
      <body className={`${prompt.className} flex flex-col h-full`}>
        <AuthProvider>
          <Navbar /> 
          <main className ="flex-1">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
