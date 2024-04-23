import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  // location.pathname - the path of the current URL
  const { pathname } = useLocation();
  return (
    <div>
      <p className="">Can't found route: {pathname}</p>
      <Button>
        <Link to={"/"}>Home</Link>
      </Button>
    </div>
  );
};

export default NotFound;
