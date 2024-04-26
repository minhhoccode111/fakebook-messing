import { Navigate, redirect } from "react-router-dom";

import { useAuthStore } from "@/main";

import EnvVar from "@/shared/constants";
const { AuthStoreName } = EnvVar;

export const loader = async () => {
  const data = {};

  useAuthStore.setState({ authData: data });

  console.log("user logged out.");

  localStorage.setItem(AuthStoreName, JSON.stringify(data));

  return redirect("/");
};

// eslint-disable-next-line react-refresh/only-export-components, @typescript-eslint/no-unused-vars
function Logout() {
  const setAuthData = useAuthStore((state) => state.setAuthData);

  // BUG: invalid call setState
  // may be because we trigger re-render before render navigate itself
  // may be can be fixed with `redirect`
  // we have to split the navigate step and the setAuthState
  // to different step
  //  NOTE: it's because we try to set `zustand` global state while rendering the `logout` component, to fix it we must remove the `Logout` component and only use the `loader` function to logout and `redirect` to `/`
  // now leave this here for learning purpose
  setAuthData({});

  console.log(`user logged out.`);

  // redirect("/");

  return <Navigate to="/" />;
}
