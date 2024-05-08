import { Outlet, useLoaderData, Navigate } from "react-router-dom";
import type { LoaderFunctionArgs } from "react-router-dom";
import axios from "axios";
import { create } from "zustand";

import { ApiOrigin, AuthStoreName } from "@/shared/constants";
import MyNavLink from "@/components/custom/my-nav-link";
import {
  ActionParamUserStore,
  StateParamUserStore,
  User,
} from "@/shared/types";

const useParamUserStore = create<StateParamUserStore & ActionParamUserStore>(
  (set) => ({
    paramUser: undefined,
    setParamUser: (newUser) => set(() => ({ paramUser: newUser })),
  }),
);

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

  // anything bad happens will be a logout
  if (isError) return <Navigate to={"/logout"}></Navigate>;

  // else set valid :userid user to global store
  const setParamUser = useParamUserStore((state) => state.setParamUser);
  setParamUser(paramUser);

  // console.log(`paramUser? `, paramUser);
  // console.log(`isError? `, isError);

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
      <Outlet></Outlet>
    </section>
  );
};
export default UserLayout;
