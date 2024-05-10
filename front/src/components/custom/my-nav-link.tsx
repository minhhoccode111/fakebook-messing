import { NavLink } from "react-router-dom";

import { Button } from "@/components/ui/button";

const MyNavLink = ({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) => {
  return (
    <Button variant={"ghost"} size={"sm"} className="capitalize">
      <NavLink
        className={({ isActive, isPending }) =>
          isPending ? "" : isActive ? "underline underline-offset-2" : ""
        }
        to={to}
      >
        {children}
      </NavLink>
    </Button>
  );
};

export default MyNavLink;
