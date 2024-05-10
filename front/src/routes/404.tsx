import { Link, useRouteError } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const error = useRouteError() as Error;

  return (
    <section>
      <div className="grid place-content-center h-screen bg-white px-4">
        <div className="text-center">
          <h1 className="text-9xl font-black text-gray-200">404</h1>

          <p className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Uh-oh!
          </p>

          <p className="">
            <i className="">{error.message}</i>
          </p>

          <p className="">
            <i className="">An error occurs</i>
          </p>

          <Button type="button" variant={"destructive"}>
            <Link to={"/"}>Go Back Home</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
