import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Amigo Leitor — Amigo secreto com livros",
  description: "Sorteie um amigo e presenteie com o livro perfeito."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <ThemeProvider>
          <AuthProvider>
            <Header />
            <main className="mx-auto max-w-6xl px-4 py-8 min-h-[calc(100vh-4rem)]">
              {children}
            </main>
            <Toaster
              position="top-right"
              toastOptions={{
                style: { background: "#3e2c1a", color: "#faf6f0", borderRadius: 12 }
              }}
            />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}