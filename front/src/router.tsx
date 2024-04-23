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
      ],
    },
  ]);

  return <RouterProvider router={router}></RouterProvider>;
};

export default Router;
