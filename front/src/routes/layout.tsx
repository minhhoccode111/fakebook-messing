import { Outlet, useLocation } from "react-router-dom";

export default function Layout() {
  // location.pathname - the path of the current URL
  const { pathname } = useLocation();

  return (
    <>
      <header className="">We are in: {pathname}</header>

      <main className="">
        <Outlet />
      </main>

      <footer className=""></footer>
    </>
  );
}
