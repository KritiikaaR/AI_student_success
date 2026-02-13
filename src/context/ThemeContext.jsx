import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext(null);
const STORAGE_KEY = "gradglow_theme";

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(STORAGE_KEY) === "dark";
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    if (typeof document === "undefined") return;

    document.documentElement.style.backgroundColor = dark ? "#0b1220" : "#f8fafc";
    document.body.style.backgroundColor = dark ? "#0b1220" : "#f8fafc";
    document.body.style.margin = "0";
  }, [dark]);

  const value = useMemo(
    () => ({
      dark,
      toggleTheme: () => setDark((current) => !current),
      setDark,
    }),
    [dark]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }
  return context;
}
