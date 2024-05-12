import { Navigate } from "react-router-dom";
import { Fragment } from "react";

import useAuthStore from "@/stores/auth";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const authData = useAuthStore((state) => state.authData);

  // any of these in valid will be a logout
  if (!authData.isLogin || !authData.token || !authData.self) {
    return <Navigate to="/logout" replace={true} />;
  }

  return <Fragment>{children}</Fragment>;
};

export default ProtectedRoute;
