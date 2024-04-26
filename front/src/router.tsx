import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NotFound from "@/routes/404";
import Layout from "@/routes/layout";
import Index from "@/routes/index";
import About from "@/routes/about";
import Login from "@/routes/login";
import Logout from "@/routes/logout";
import Signup from "@/routes/signup";
import Fakebook from "@/routes/fakebook";
import FakebookLayout from "@/routes/fakebook-layout";
import Profile from "@/routes/profile";
import Messing from "@/routes/messing";
import MessingLayout from "@/routes/messing-layout";
import Chat from "@/routes/chat";

import ProtectedRoute from "./components/protected-route";

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
          element: (
            // authentication wrapper
            <ProtectedRoute>
              <FakebookLayout />,
            </ProtectedRoute>
          ),
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
          element: (
            // authentication wrapper
            <ProtectedRoute>
              <MessingLayout />
            </ProtectedRoute>
          ),
          errorElement: <NotFound />,
          children: [
            {
              index: true,
              errorElement: <NotFound />,
              element: <Messing />,
            },
            {
              // path: ":groupid",
              // path: ":userid",
              path: ":chatid",
              element: <Chat />,
            },
          ],
        },

        {
          path: "login",
          element: <Login />,
        },

        {
          path: "logout",
          element: <Logout />,
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
