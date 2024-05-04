import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NotFound from "@/routes/404";
import Layout from "@/routes/layout";
import Index from "@/routes/index";
import About from "@/routes/about";
import Login from "@/routes/login";
import Signup from "@/routes/signup";
import { loader as logoutLoader } from "@/routes/logout";

import FakebookLayout, {
  loaderFakebookLayout,
} from "@/routes/fakebook/fakebook-layout";
import FakebookFeed, {
  loaderFakebookFeed,
} from "@/routes/fakebook/fakebook-feed";
import ProfileLayout from "@/routes/fakebook/profile/profile-layout";
import ProfileToUserid, {
  loaderUseridToInfo,
} from "@/routes/fakebook/profile/profile-navigate";

import UserLayout from "@/routes/fakebook/profile/user/user-layout";
import UserInfo from "@/routes/fakebook/profile/user/user-info";
import UserPosts from "@/routes/fakebook/profile/user/user-posts";
import UserConnections from "@/routes/fakebook/profile/user/user-connections";

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
              loader: loaderFakebookLayout,
            },

            {
              path: "feed",
              element: <FakebookFeed />,
              loader: loaderFakebookFeed,
            },

            {
              path: "profile",
              element: <ProfileLayout />, // just a simple Outlet
              errorElement: <NotFound />,
              children: [
                {
                  index: true,
                  //  navigate to current user /:userid using component
                  //  because we have to access useAuthStore of zustand
                  //  which can only be called inside a component (?)

                  element: <ProfileToUserid />,
                },

                {
                  path: ":userid",
                  element: <UserLayout />,
                  children: [
                    {
                      index: true,
                      loader: loaderUseridToInfo,
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
