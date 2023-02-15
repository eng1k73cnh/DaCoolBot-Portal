import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";

const ThemeChanger = (props: {
  setAppTheme: (theme: "dark" | "light") => void;
}) => {
  // Get user preference
  const [theme, setTheme] = useState("dark");

  const changeThemeColor = () => {
    setTheme(theme === "light" ? "dark" : "light");
    props.setAppTheme(theme === "light" ? "dark" : "light");
    localStorage.setItem("theme", theme === "light" ? "dark" : "light");
  };

  useEffect(() => {
    const htmlSelector = document.querySelector("html");
    if (!htmlSelector) return;
    if (theme === "dark") {
      htmlSelector.classList.add("dark");
      htmlSelector.classList.remove("light");
    } else {
      htmlSelector.classList.add("light");
      htmlSelector.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    const localTheme = localStorage.getItem("theme");
    if (localTheme) {
      setTheme(localTheme);
    }
  }, []);

  useEffect(() => {
    setTheme(
      window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
    );
  }, []);

  return (
    <button
      title="Toggle Dark Mode"
      className="flex space-x-2 transition-colors btn btn-circle items-center justify-center bg-gray-200"
      onClick={changeThemeColor}
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
