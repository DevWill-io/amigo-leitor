import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });


export const dynamic = "force-dynamic";

// ✅ DEPOIS
export const metadata: Metadata = {
  title: "Amigo Leitor — Amigo secreto com livros",
  description: "Sorteie um amigo e presenteie com o livro perfeito."
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#C96F4A"  // ← movido pra cá
};

// 👇 Viewport específico para Android/iOS com notch
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,       // permite zoom acessível
  viewportFit: "cover",  // respeita notch e gesture bar
  themeColor: "#C96F4A"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <ThemeProvider>
          <AuthProvider>
            <Header />
            <main className="mx-auto max-w-6xl px-3 sm:px-4 py-6 sm:py-8 pb-bottom-nav md:pb-8">
              {children}
            </main>
            <BottomNav />
            <Toaster
              position="top-center"
              toastOptions={{
                style: {
                  background: "#4A2E1F",
                  color: "#FDF7F0",
                  borderRadius: 14,
                  fontSize: "14px",
                  padding: "12px 16px"
                },
                success: { iconTheme: { primary: "#C96F4A", secondary: "#FDF7F0" } }
              }}
            />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
