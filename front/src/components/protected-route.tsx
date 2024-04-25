import { Fragment } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "./auth-provider";
import { ReactPropChildren } from "@/shared/types";

const ProtectedRoute = ({ children }: ReactPropChildren) => {
  const isLogin = useAuthStore((state) => state.authData);

  if (!isLogin) {
    return <Navigate to="/" replace={true} />;
  }

  return <Fragment>{children}</Fragment>;
};

export default ProtectedRoute;
