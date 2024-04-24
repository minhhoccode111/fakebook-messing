import { Outlet, useLocation } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";

import SetTheme from "@/components/set-theme";

const Layout = () => {
  // display a path to current for debug
  const { pathname } = useLocation();

  return (
    // theme wrapper
    <ThemeProvider defaultTheme="dark" storageKey="cv-application-top-theme">
      <header className="flex gap-4 items-center justify-between p-4">
        <h1 className="">We are in: {pathname}</h1>
        {/* button toggle theme */}
        <SetTheme />
      </header>

      <main className="">
        <Outlet />
      </main>

      <footer className=""></footer>
    </ThemeProvider>
  );
};

export default Layout;
