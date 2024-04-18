import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NotFound from "./404";
import Layout from "./layout";
import Index from "./index";

export default function Router() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <NotFound />,
      children: [
        {
          index: true,
          element: <Index />,
          errorElement: <NotFound />,
        },

        {
          path: "profile",
          // element: <Profile />,
        },

        {
          path: "chat",
          // element: <Chat />,
        },

        {
          path: "login",
          // element: <Login />,
        },

        {
          path: "logout",
          // element: <Logout />,
        },

        {
          path: "signup",
          // element: <Signup />,
        },

        {
          path: "about",
          // element: <About />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}
