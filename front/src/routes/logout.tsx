import { redirect } from "react-router-dom";

import useAuthStore from "@/stores/auth";

import { AuthStoreName } from "@/shared/constants";

export const loader = async () => {
  const data = {};

  useAuthStore.setState({ authData: data });

  localStorage.setItem(AuthStoreName, JSON.stringify(data));

  console.log("user logged out.");

  return redirect("/login");
};
