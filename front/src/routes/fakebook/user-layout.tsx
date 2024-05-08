import { Outlet, Navigate, useParams } from "react-router-dom";
import axios from "axios";
import { create } from "zustand";

import { ApiOrigin } from "@/shared/constants";
import MyNavLink from "@/components/custom/my-nav-link";
import { ActionParamUserStore, StateParamUserStore } from "@/shared/types";
import { useAuthStore } from "@/main";
import { useEffect, useState } from "react";

export const useParamUserStore = create<
  StateParamUserStore & ActionParamUserStore
>((set) => ({
  paramUser: undefined,
  setParamUser: (newUser) => set(() => ({ paramUser: newUser })),
}));

const useCheckParamUserid = () => {
  const { userid } = useParams();

  const token = useAuthStore((state) => state.authData.token);
  const setParamUser = useParamUserStore((state) => state.setParamUser);

  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const tmp = async () => {
      try {
        const res = await axios({
          url: ApiOrigin + `/users/${userid}`,
          method: "get",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // console.log(res.data);

        setParamUser(res.data);
      } catch (err) {
        // console.log(err);

        setIsError(true);
      }
    };

    tmp();
  }, []);

  return { isError };
};

const UserLayout = () => {
  const { isError } = useCheckParamUserid();

  // anything bad happens will be a logout
  if (isError) return <Navigate to={"/logout"}></Navigate>;

  // console.log(`paramUser? `, paramUser);
  // console.log(`isError? `, isError);

  return (
    <div className="border border-black flex-1">
      <nav className="flex justify-end gap-4">
        <MyNavLink to={"info"}>info</MyNavLink>

        <MyNavLink to={"posts"}>posts</MyNavLink>

        <MyNavLink to={"connections"}>connections</MyNavLink>
      </nav>

      {/* only pass user data down to outlet if existed */}
      {<Outlet></Outlet>}
    </div>
  );
};
export default UserLayout;
