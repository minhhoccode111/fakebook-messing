import { Outlet, useLocation } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";

import ThemeToggler from "@/components/theme-toggler";

const Layout = () => {
  // display a path to current for debug
  const { pathname } = useLocation();

  return (
    // wrapper to change root classes each time theme changes
    <ThemeProvider>
      <header className="flex gap-4 items-center justify-between p-4">
        <h1 className="">We are in: {pathname}</h1>
        <ThemeToggler />
      </header>

      <main className="">
        <Outlet />
      </main>

      <footer className=""></footer>
    </ThemeProvider>
  );
};

export default Layout;
