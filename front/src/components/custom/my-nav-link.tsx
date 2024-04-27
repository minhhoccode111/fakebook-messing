import { NavLink } from "react-router-dom";

const MyNavLink = ({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) => {
  return (
    <NavLink
      className={({ isActive, isPending }) =>
        isPending ? "" : isActive ? "text-red-500" : ""
      }
      to={to}
    >
      {children}
    </NavLink>
  );
};

export default MyNavLink;
