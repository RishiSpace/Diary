import React from "react";

export default function ThemeSwitcher({ theme, setTheme }: { theme: string; setTheme: (t: string) => void }) {
  return (
    <div className="theme-switcher">
      <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}> 
        Switch to {theme === "dark" ? "Light" : "Dark"} Theme
      </button>
    </div>
  );
}