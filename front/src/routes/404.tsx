import {
  // Link ,
  useRouteError,
} from "react-router-dom";

export default function NotFound() {
  const error: unknown = useRouteError();

  console.error(error);

  return <main>Hello from 404</main>;
}
