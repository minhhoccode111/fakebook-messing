import { Link, Outlet } from "react-router-dom";
import ThemeProvider from "@/components/theme-provider";
import ThemeToggler from "@/components/theme-toggler";
import useAuthStore from "@/stores/auth";

import MyNavLink from "@/components/custom/my-nav-link";

const Layout = () => {
  // display a path to current for debug
  const isLogin = useAuthStore((state) => state.authData?.isLogin);

  return (
    // wrapper to change root classes each time theme changes
    <ThemeProvider>
      <div
        id="wrapper"
        className="flex flex-1 flex-col gap-2 p-4 bg-white dark:bg-gray-800"
      >
        <header className="flex gap-2 items-center justify-between">
          <h1 className="font-bold">
            <Link to={"/"}>Fakebook Messing</Link>
          </h1>

          <div className="">
            <ThemeToggler />
          </div>

          <nav className="flex gap-4">
            <MyNavLink to="/">home</MyNavLink>

            <MyNavLink to="fakebook">fakebook</MyNavLink>

            <MyNavLink to="messing">messing</MyNavLink>

            <MyNavLink to="about">about</MyNavLink>

            {!isLogin ? (
              <>
                <MyNavLink to="login">login</MyNavLink>

                <MyNavLink to="signup">signup</MyNavLink>
              </>
            ) : (
              <MyNavLink to="logout">logout</MyNavLink>
            )}
          </nav>
        </header>

        <main className="flex-1 flex flex-col gap-2">
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
