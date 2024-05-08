import { Outlet, useLoaderData, Navigate } from "react-router-dom";
import type { LoaderFunctionArgs } from "react-router-dom";
import MyNavLink from "@/components/custom/my-nav-link";
import axios from "axios";
import { ApiOrigin, AuthStoreName } from "@/shared/constants";
import { User } from "@/shared/types";

// check :userid existed
export const profileCheckUserid = async ({ params }: LoaderFunctionArgs) => {
  const { userid } = params;

  // protected route component already checked the localstorage, we can trust
  const authDataLocalStorage = localStorage.getItem(AuthStoreName) as string;
  const authData = JSON.parse(authDataLocalStorage);

  let paramUser;
  let isError;

  try {
    const res = await axios({
      url: ApiOrigin + `/users/${userid}`,
      method: "get",
      headers: {
        Authorization: `Bearer ${authData.token}`,
      },
    });

    // console.log(res.data);

    paramUser = res.data;
  } catch (err) {
    // console.log(err);

    isError = true;
  }

  return { paramUser, isError };
};

const UserLayout = () => {
  const { paramUser, isError } = useLoaderData() as {
    isError: boolean;
    paramUser: User;
  };

  // console.log(`paramUser? `, paramUser);
  // console.log(`isError? `, isError);

  // anything bad happens will be a logout
  if (isError) return <Navigate to={"/logout"}></Navigate>;

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
      <Outlet context={{ paramUser }}></Outlet>
    </section>
  );
};
export default UserLayout;
