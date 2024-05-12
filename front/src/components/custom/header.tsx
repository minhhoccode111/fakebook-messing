import { Link } from "react-router-dom";

import MyNavLink from "@/components/custom/my-nav-link";
import ThemeToggler from "@/components/theme-toggler";
import useAuthStore from "@/stores/auth";

const Header = () => {
  // display a path to current for debug
  const isLogin = useAuthStore((state) => state.authData?.isLogin);

  return (
    <header className="flex gap-2 items-center justify-between">
      <h1 className="font-bold text-2xl">
        <Link to={"/"}>Fakebook Messing</Link>
      </h1>

      <div className="flex gap-8">
        <ThemeToggler />

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
      </div>
    </header>
  );
};

export default Header;
