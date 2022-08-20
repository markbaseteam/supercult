import { Switch } from "@headlessui/react";
import { MoonIcon, SunIcon } from "@heroicons/react/solid";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { classNames } from "../utils/misc";

export function ThemeChanger() {
  const [mounted, setMounted] = useState(false);
  const { theme, systemTheme, setTheme } = useTheme();

  // When mounted on client, now we can show the UI
  useEffect(() => {
    if (theme === "system") {
      setTheme(systemTheme ?? "dark");
    }
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const toggleTheme = () => {
    if (theme === "dark") setTheme("light");
    else if (theme === "light") setTheme("dark");
    else if (theme === "system")
      setTheme(systemTheme === "dark" ? "light" : "dark");
  };

  return (
    <div>
      <Switch
        checked={theme === "dark"}
        onChange={toggleTheme}
        className={classNames(
          theme === "dark" ? "bg-black" : "bg-gray-200",
          "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        )}
      >
        <span className="sr-only">Use setting</span>
        <span
          className={classNames(
            theme === "dark" ? "translate-x-5" : "translate-x-0",
            "pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
          )}
        >
          <span
            className={classNames(
              theme === "dark"
                ? "opacity-0 ease-out duration-100"
                : "opacity-100 ease-in duration-200",
              "absolute inset-0 h-full w-full flex items-center justify-center transition-opacity"
            )}
            aria-hidden="true"
          >
            <SunIcon className="h-3 w-3 text-gray-400" />
          </span>
          <span
            className={classNames(
              theme === "dark"
                ? "opacity-100 ease-in duration-200"
                : "opacity-0 ease-out duration-100",
              "absolute inset-0 h-full w-full flex items-center justify-center transition-opacity"
            )}
            aria-hidden="true"
          >
            <MoonIcon className="h-3 w-3 text-black" />
          </span>
        </span>
      </Switch>
    </div>
  );
}
