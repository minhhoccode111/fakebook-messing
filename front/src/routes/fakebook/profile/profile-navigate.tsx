import { redirect } from "react-router-dom";

import EnvVar from "@/shared/constants";
const { AuthStoreName } = EnvVar;

export const useridNavigateToInfo = () => {
  return redirect("info");
};

export const profileNavigateToUserid = () => {
  // because the protected route component already checked the local storage so we can trust
  const authDataLocalStorage = localStorage.getItem(AuthStoreName) as string;
  const authData = JSON.parse(authDataLocalStorage);
  return redirect(authData.self.id);
};
