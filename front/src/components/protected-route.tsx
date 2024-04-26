import { Fragment } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/main";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isLogin = useAuthStore((state) => state.authData?.isLogin);

  if (!isLogin) {
    return <Navigate to="/login" replace={true} />;
  }

  return <Fragment>{children}</Fragment>;
};

export default ProtectedRoute;
