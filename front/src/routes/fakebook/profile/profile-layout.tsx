import { useLocation } from "react-router-dom";

const ProfileLayout = () => {
  const { pathname } = useLocation();

  return <section>{pathname}</section>;
};
export default ProfileLayout;
