import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NotFound from "@/routes/404";
import Layout from "@/routes/layout";
import Index from "@/routes/index";
import About from "@/routes/about";
import Login from "@/routes/login";
import Signup from "@/routes/signup";
import { loader as logoutLoader } from "@/routes/logout";

import FakebookLayout, {
  fakebookNavigateToFeed,
} from "@/routes/fakebook/fakebook-layout";
import {
  profileNavigateToUserid,
  useridNavigateToInfo,
} from "@/routes/fakebook/profile-navigate";
import FakebookFeed from "@/routes/fakebook/fakebook-feed";
import ProfileLayout from "@/routes/fakebook/profile-layout";

import UserInfo from "@/routes/fakebook/user-info";
import UserPosts from "@/routes/fakebook/user-posts";
import UserLayout from "@/routes/fakebook/user-layout";
import UserConnections from "@/routes/fakebook/user-connections";

import ChatMessing from "@/routes/messing/chat-messing";
import IndexMessing from "@/routes/messing/index-messing";
import LayoutMessing from "@/routes/messing/layout-messing";

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
              // /fakebook go to /feed by default
              loader: fakebookNavigateToFeed,
            },

            {
              path: "feed",
              element: <FakebookFeed />,
            },

            {
              path: "profile",
              element: <ProfileLayout />, // just a simple Outlet
              errorElement: <NotFound />,
              children: [
                {
                  index: true,
                  // /profile go to /:userid by default
                  loader: profileNavigateToUserid,
                },

                {
                  path: ":userid",
                  // layout and check :userid existed
                  element: <UserLayout />,
                  children: [
                    {
                      index: true,
                      // /:userid go to /info by default
                      loader: useridNavigateToInfo,
                    },

                    {
                      path: "info",
                      element: <UserInfo />,
                    },

                    {
                      path: "posts",
                      element: <UserPosts />,
                    },

                    {
                      path: "connections",
                      element: <UserConnections />,
                    },
                  ],
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
              path: "users/:userid",
              element: <ChatMessing />,
            },

            {
              path: "groups/:groupid",
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
