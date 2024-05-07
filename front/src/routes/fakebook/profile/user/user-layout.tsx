import { Outlet, useOutletContext, useLoaderData } from "react-router-dom";
import Custom from "@/components/custom";

const { MyNavLink } = Custom;

export const profileCheckUserid = async ({ request, params }) => {
  // check :userid existed
  //  TODO: work on this after /feed
  return null;
};
const UserLayout = () => {
  // extract :userid's data
  //  TODO: work on this after /feed
  const user = useLoaderData();

  return (
    <section>
      <header className="">
        <nav className="flex justify-end gap-4">
          <MyNavLink to={"info"}>info</MyNavLink>

          <MyNavLink to={"posts"}>posts</MyNavLink>

          <MyNavLink to={"connections"}>connections</MyNavLink>
        </nav>
      </header>
      {/* pass user data down to outlet */}
      // TODO: work on this after /feed
      <Outlet></Outlet>
    </section>
  );
};
export default UserLayout;
