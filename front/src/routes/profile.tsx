import { useLocation } from "react-router-dom";

export default function Profile() {
  const { pathname } = useLocation();

  return <section>{pathname}</section>;
}
