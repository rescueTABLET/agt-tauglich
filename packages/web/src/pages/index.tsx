import { Suspense, lazy } from "react";
import { RouterProvider } from "react-router";
import { createBrowserRouter } from "react-router-dom";
import GlobalLoading from "../components/GlobalLoading";

const Home = lazy(() => import("./Home"));

const router = createBrowserRouter([{ index: true, element: <Home /> }]);

export default function Pages() {
  return (
    <Suspense fallback={<GlobalLoading />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}
