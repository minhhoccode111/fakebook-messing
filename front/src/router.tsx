import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./routes/layout";
import NotFound from "./routes/404";
import Index from "./routes/index";

const Router = () => {
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
          element: <Profile />,
        },

        {
          path: "chat",
          element: <Chat />,
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
};

export default Router;
