import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NotFound from "@/routes/404";
import Layout from "@/routes/layout";
import Index from "@/routes/index";
import About from "@/routes/about";
import Login from "@/routes/login";
import Signup from "@/routes/signup";
import { loader as logoutLoader } from "@/routes/logout";

import FakebookLayout from "@/routes/fakebook/fakebook-layout";
import Feed from "@/routes/fakebook/feed";
import ProfileLayout from "@/routes/fakebook/profile/profile-layout";

import IndexMessing from "@/routes/messing/index-messing";
import LayoutMessing from "@/routes/messing/layout-messing";
import ChatMessing from "@/routes/messing/chat-messing";

import ProtectedRoute from "@/components/protected-route";

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
          // loader: goToAbout?
        },

        {
          path: "fakebook",
          element: (
            // authentication wrapper
            <ProtectedRoute>
              <FakebookLayout />
            </ProtectedRoute>
          ),
          errorElement: <NotFound />,
          children: [
            {
              index: true,
              // loader: goToFeed
            },

            {
              path: "feed",
              element: <Feed />,
            },

            {
              path: ":userid",
              element: <ProfileLayout />,
              errorElement: <NotFound />,
              children: [
                {
                  index: true,
                  // loader: goToInfo
                },
                {
                  path: "info",
                  // element: <FakebookProfileInfo/>
                },
                {
                  path: "posts",
                  // element: <FakebookProfilePosts/>
                },
              ],
            },
          ],
        },

        {
          path: "messing",
          element: (
            // authentication wrapper
            <ProtectedRoute>
              <LayoutMessing />
            </ProtectedRoute>
          ),
          errorElement: <NotFound />,
          children: [
            {
              index: true,
              errorElement: <NotFound />,
              element: <IndexMessing />,
            },
            {
              // path: ":groupid",
              // path: ":userid",
              path: ":chatid",
              element: <ChatMessing />,
            },
          ],
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
