import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NotFound from "@/routes/404";
import Layout from "@/routes/layout";
import Index from "@/routes/index";
import About from "@/routes/about";
import Login from "@/routes/login";
import { loader as logoutLoader } from "@/routes/logout";
import Signup from "@/routes/signup";
import Fakebook from "@/routes/fakebook";
import FakebookLayout from "@/routes/fakebook-layout";
import Messing from "@/routes/messing";
import Profile from "@/routes/profile";

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
        },

        {
          path: "fakebook",
          element: <FakebookLayout />,
          errorElement: <NotFound />,
          children: [
            {
              index: true,
              errorElement: <NotFound />,
              element: <Fakebook />,
            },
            {
              path: ":userid",
              element: <Profile />,
            },
          ],
        },

        {
          path: "messing",
          element: <Messing />,
        },

        {
          path: "login",
          element: <Login />,
        },

        {
          path: "logout",
          loader: logoutLoader,
        },

        {
          path: "signup",
          element: <Signup />,
        },

        {
          path: "about",
          element: <About />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router}></RouterProvider>;
}
