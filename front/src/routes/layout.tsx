import { Outlet, useLocation } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/auth-provider";

import SetTheme from "@/components/set-theme";

const Layout = () => {
  // display a path to current for debug
  const { pathname } = useLocation();

  return (
    // wrapper to change root classes each time theme changes
    <ThemeProvider>
      <AuthProvider>
        <header className="flex gap-4 items-center justify-between p-4">
          <h1 className="">We are in: {pathname}</h1>
          {/* button toggle theme */}
          <SetTheme />
        </header>

        <main className="">
          <Outlet />
        </main>

        <footer className=""></footer>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default Layout;
