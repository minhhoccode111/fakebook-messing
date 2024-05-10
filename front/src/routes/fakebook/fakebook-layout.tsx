import { Outlet, redirect } from "react-router-dom";
import useAuthStore from "@/stores/auth";

import MyNavLink from "@/components/custom/my-nav-link";

export const fakebookNavigateToFeed = () => {
  return redirect("feed");
};

const FakebookLayout = () => {
  const authData = useAuthStore((state) => state.authData);

  return (
    <section className="flex-1 flex flex-col gap-2 border border-red-400">
      <header className="">
        <nav className="flex justify-end gap-4">
          <MyNavLink to="feed">feed</MyNavLink>

          <MyNavLink to="profile">profile</MyNavLink>
        </nav>
      </header>

      <Outlet></Outlet>

      <footer className="">
        <h2 className="">Is logged in: {authData.isLogin ? "yes" : "no"}</h2>
        <h2 className="">User fullname: {authData.self?.fullname}</h2>
      </footer>
    </section>
  );
};

export default FakebookLayout;
