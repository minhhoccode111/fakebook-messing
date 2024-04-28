import { Outlet } from "react-router-dom";
import Custom from "@/components/custom";

const { MyNavLink } = Custom;

const UserLayout = () => {
  return (
    <section>
      <header className="">
        <nav className="flex justify-end gap-4">
          <MyNavLink to={"info"}>info</MyNavLink>

          <MyNavLink to={"posts"}>posts</MyNavLink>

          <MyNavLink to={"connections"}>connections</MyNavLink>
        </nav>
      </header>

      <Outlet></Outlet>
    </section>
  );
};
export default UserLayout;
