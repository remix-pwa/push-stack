import type { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { redirect } from "remix-typedjson"
import { getUserId } from "~/utils/server/user.server"

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await getUserId(request)

  if (user) {
    return redirect("/dashboard");
  }

  return null;
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Outlet />
  )
}