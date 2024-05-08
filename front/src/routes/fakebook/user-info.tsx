import { useParamUserStore } from "@/routes/fakebook/user-layout";
import { useAuthStore } from "@/main";

const UserInfo = () => {
  const { self, token } = useAuthStore((state) => state.authData);

  const paramUser = useParamUserStore((state) => state.paramUser);

  // identify authorization of current profile
  const isSelf = paramUser?.id === self?.id;

  console.log(isSelf);

  return <></>;
};

export default UserInfo;
