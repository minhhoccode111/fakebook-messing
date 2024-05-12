import { Outlet, Navigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import { ApiOrigin } from "@/shared/constants";
import { User } from "@/shared/types";

import useParamUserStore from "@/stores/param-user";
import useAuthStore from "@/stores/auth";

import LoadingWrapper from "@/components/custom/loading-wrapper";
import MyNavLink from "@/components/custom/my-nav-link";

const useCheckParamUserid = () => {
  const { userid } = useParams();

  const authData = useAuthStore((state) => state.authData);
  const selfid = authData.self?.id;

  const isSelf = userid === selfid;

  const setParamUser = useParamUserStore((state) => state.setParamUser);

  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const tmp = async () => {
      try {
        const res = await axios({
          url: ApiOrigin + `/users/${userid}`,
          method: "get",
          headers: {
            Authorization: `Bearer ${authData.token}`,
          },
        });

        // console.log(res.data);

        setParamUser(res.data);
      } catch (err) {
        // console.log(err);

        setIsError(true);
      }
    };

    // only fetch is current userid param is not self
    if (!isSelf) tmp();
    else setParamUser(authData.self as User);
  }, [userid, authData.self]);

  return { isError };
};

const UserLayout = () => {
  const { isError } = useCheckParamUserid();

  const paramUser = useParamUserStore((state) => state.paramUser);

  // anything bad happens will be a logout
  if (isError) return <Navigate to={"/logout"}></Navigate>;

  // console.log(`paramUser? `, paramUser);
  // console.log(`isError? `, isError);

  return (
    <div className="flex-1">
      <nav className="flex justify-end gap-4">
        <MyNavLink to={"info"}>info</MyNavLink>

        <MyNavLink to={"posts"}>posts</MyNavLink>

        <MyNavLink to={"connections"}>connections</MyNavLink>
      </nav>

      {/* only pass user data down to outlet when paramUser is checked and ready */}
      {/* use different approach because we want to place it center of the screen */}
      {isError || !paramUser ? (
        <div className="h-full grid place-items-center">
          <LoadingWrapper isLoading={!paramUser} isError={isError}>
            <></>
          </LoadingWrapper>
        </div>
      ) : (
        <Outlet></Outlet>
      )}
    </div>
  );
};
export default UserLayout;
