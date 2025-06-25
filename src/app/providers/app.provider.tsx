import { FC } from "react";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { router } from "../../routes/routes";
import { QueryProvider } from "./query.provider";
import { SeoProvider } from "./helmet.provider";
// import { useAuthStore } from "@/features/auth/stores/auth.store";
// import Loading from "@/components/common/Loading";

export const AppProvider: FC = () => {
  // const { initializeSession, isLoading } = useAuthStore();

  // useEffect(() => {
  //   initializeSession();
  // }, [initializeSession]);

  // if (isLoading) return <Loading />;

  return (
    <QueryProvider>
      <SeoProvider>
        <Toaster position="bottom-left" />
        <RouterProvider router={router} />
      </SeoProvider>
    </QueryProvider>
  );
};