"use client";
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";
const ThemeCtx = createContext<{ theme: Theme; toggle: () => void }>({
  theme: "light", toggle: () => {}
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const salvo = (localStorage.getItem("theme") as Theme) || "light";
    setTheme(salvo);
    document.documentElement.classList.toggle("dark", salvo === "dark");
  }, []);

  const toggle = () => {
    const novo = theme === "light" ? "dark" : "light";
    setTheme(novo);
    localStorage.setItem("theme", novo);
    document.documentElement.classList.toggle("dark", novo === "dark");
  };

  return <ThemeCtx.Provider value={{ theme, toggle }}>{children}</ThemeCtx.Provider>;
}

export const useTheme = () => useContext(ThemeCtx);