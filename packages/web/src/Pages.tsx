import { RouterProvider, createRouter } from "@tanstack/react-router";
import { Suspense } from "react";
import GlobalLoading from "./components/GlobalLoading";
import { routeTree } from "./routeTree.gen";

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function Pages() {
  return (
    <Suspense fallback={<GlobalLoading />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}
