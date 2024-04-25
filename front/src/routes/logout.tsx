import { Navigate } from "react-router-dom";

import { useAuthStore } from "@/main";

export default function Logout() {
  const setAuthData = useAuthStore((state) => state.setAuthData);

  setAuthData({});

  console.log(`user logged out.`);

  return <Navigate to="/" />;
}
