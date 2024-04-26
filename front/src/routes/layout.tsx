import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import ThemeProvider from "@/components/theme-provider";
import ThemeToggler from "@/components/theme-toggler";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/main";

const Layout = () => {
  // display a path to current for debug
  const { pathname } = useLocation();
  const isLogin = useAuthStore((state) => state.authData?.isLogin);

  return (
    // wrapper to change root classes each time theme changes
    <ThemeProvider>
      <div
        id="wrapper"
        className="flex flex-col gap-2 h-screen min-h-screen bg-gray-400 dark:bg-gray-800 p-4"
      >
        <header className="flex gap-2 items-center justify-between">
          <h1 className="font-bold">
            <Link to={"/"}>Fakebook Messing</Link>
          </h1>
          <nav className="flex gap-4">
            <Button>
              <NavLink to={"/"}>Home</NavLink>
            </Button>
            <Button>
              <NavLink to={"fakebook"}>Fakebook</NavLink>
            </Button>
            <Button>
              <NavLink to={"messing"}>Messing</NavLink>
            </Button>
            {!isLogin ? (
              <>
                <Button>
                  <NavLink to={"signup"}>Signup</NavLink>
                </Button>
                <Button>
                  <NavLink to={"login"}>Login</NavLink>
                </Button>
              </>
            ) : (
              <Button>
                <NavLink to={"logout"}>Logout</NavLink>
              </Button>
            )}
          </nav>
          <div className="">
            <ThemeToggler />
          </div>
        </header>

        <main className="flex-1">
          <h2 className="">At: {pathname}</h2>
          <Outlet></Outlet>
        </main>

        <footer className="">
          <p className="">Made by minhhoccode</p>
        </footer>
      </div>
    </ThemeProvider>
  );
};

export default Layout;
