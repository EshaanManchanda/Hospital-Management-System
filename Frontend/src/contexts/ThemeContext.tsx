import React, { createContext, useContext, useState, useEffect } from "react";

// Define theme types
export type Theme = "light" | "dark" | "system";

// Define context type
type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

// Create context with default values
export const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  setTheme: () => {},
  toggleTheme: () => {},
});

// Custom hook for accessing theme context
export const useTheme = () => useContext(ThemeContext);

// Theme provider component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get stored theme from localStorage or use default
  const [theme, setThemeState] = useState<Theme>(() => {
    const storedTheme = localStorage.getItem("hospital-theme");
    return (storedTheme as Theme) || "light";
  });

  // Function to set theme and store in localStorage
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("hospital-theme", newTheme);
  };

  // Toggle between light and dark themes
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // Apply theme to document
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove previous theme classes
    root.classList.remove("light-theme", "dark-theme");
    
    // Apply system theme or specified theme
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      root.classList.add(`${systemTheme}-theme`);
    } else {
      root.classList.add(`${theme}-theme`);
    }
    
    // Set data-theme attribute for components that use it
    root.setAttribute("data-theme", theme === "system" 
      ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
      : theme
    );
  }, [theme]);

  // Listen for system theme changes if using system theme
  useEffect(() => {
    if (theme !== "system") return;
    
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleChange = () => {
      const root = window.document.documentElement;
      const systemTheme = mediaQuery.matches ? "dark" : "light";
      
      root.classList.remove("light-theme", "dark-theme");
      root.classList.add(`${systemTheme}-theme`);
      root.setAttribute("data-theme", systemTheme);
    };
    
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}; 