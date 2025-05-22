import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const queryClient = new QueryClient();

export const Route = createRootRoute({
  component: () => (
    <>
      <Navbar></Navbar>

      <QueryClientProvider client={queryClient}>
        <Outlet />

        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>

      <TanStackRouterDevtools />

      <Footer></Footer>
    </>
  ),
});
