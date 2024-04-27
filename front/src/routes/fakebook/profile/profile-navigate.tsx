import { Navigate, redirect } from "react-router-dom";
import { useAuthStore } from "@/main";

export const loaderUseridToInfo = () => {
  return redirect("info");
};

const ProfileToUserid = () => {
  // will be string because protected route wrapper already check login
  const id = useAuthStore().authData.self?.id as string;

  return <Navigate to={id}></Navigate>;
};

export default ProfileToUserid;
