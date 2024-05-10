import { Outlet, redirect } from "react-router-dom";

import MyNavLink from "@/components/custom/my-nav-link";

export const fakebookNavigateToFeed = () => {
  return redirect("feed");
};

const FakebookLayout = () => {
  return (
    <section className="flex-1 flex flex-col gap-2">
      <header className="">
        <nav className="flex justify-end gap-4">
          <MyNavLink to="feed">feed</MyNavLink>

          <MyNavLink to="profile">profile</MyNavLink>
        </nav>
      </header>

      <Outlet></Outlet>
    </section>
  );
};

export default FakebookLayout;
