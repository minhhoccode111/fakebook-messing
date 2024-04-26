import { Outlet } from "react-router-dom";
import { useAuthStore } from "@/main";

const MessingLayout = () => {
  const authData = useAuthStore((state) => state.authData);

  return (
    <section>
      <h2 className="">Is logged in: {authData.isLogin ? "yes" : "no"}</h2>
      <h2 className="">User fullname: {authData.self?.fullname}</h2>
      <Outlet></Outlet>
    </section>
  );
};

export default MessingLayout;
