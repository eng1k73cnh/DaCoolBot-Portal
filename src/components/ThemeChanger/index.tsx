import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";

type Theme = "dark" | "light";

const ThemeChanger = (props: { setAppTheme: (theme: Theme) => void }) => {
  // Get user preference
  const [theme, setTheme] = useState("dark");
  const [mounted, setMounted] = useState(false);

  const changeThemeColor = (theme: Theme) => {
    setTheme(theme);
    props.setAppTheme(theme);
  };

  useEffect(() => {
    if (!mounted) {
      const localTheme = localStorage.getItem("dcb:theme") as Theme | null;
      if (localTheme) {
        changeThemeColor(localTheme);
      } else {
        changeThemeColor(
          window.matchMedia &&
            window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light"
        );
      }
      return setMounted(true);
    }

    const htmlSelector = document.querySelector("html");
    if (!htmlSelector) return;

    htmlSelector.setAttribute("data-theme", theme);
    htmlSelector.classList.toggle("dark", theme === "dark");

    localStorage.setItem("dcb:theme", theme);
  }, [theme, mounted]);

  return (
    <button
      title="Toggle Dark Mode"
      className="flex space-x-2 transition-colors btn btn-circle items-center justify-center bg-gray-200"
      onClick={() => changeThemeColor(theme === "light" ? "dark" : "light")}
    >
      <FontAwesomeIcon
        className="h-5 w-5"
        size="lg"
        icon={theme === "dark" ? faSun : faMoon}
        style={{ color: theme === "dark" ? "#FFD700" : "#000000" }}
      />
    </button>
  );
};

export default ThemeChanger;
