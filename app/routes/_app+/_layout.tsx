import type { WorkerActionArgs, WorkerLoaderArgs } from "@remix-pwa/sw";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { Form, Outlet, useLoaderData } from "@remix-run/react";
import { useEffect } from "react";
import { typedjson } from "remix-typedjson";
import { Input } from "~/components/ui/input";
import { requireUserId } from "~/utils/server/user.server";
import type { GetLoadContextType } from "~/utils/worker/types";

export const workerAction = async ({ context }: WorkerActionArgs) => {
  const { getConnectivityStatus } = context as GetLoadContextType;

  console.log(await getConnectivityStatus());

  return null;
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await requireUserId(request);

  return user;
}

export const workerLoader = async ({ context }: WorkerLoaderArgs) => {
  const { getConnectivityStatus } = context as GetLoadContextType;

  const c = await getConnectivityStatus();
  console.log(c, 'user');

  return typedjson({
    status: "success",
    connectivity: c,
  });
}

export default function DashboardLayout() {
  return (
    <div className="flex flex-col w-full h-screen">
      <header className="flex content-center justify-between w-full h-16 shadow-md">
        <section></section>
        <section>

        </section>
      </header>
      <section className="flex w-full h-full">
        <aside className="max-w-sm border-r border-r-slate-500">
          <Form>
            <Input placeholder="Search Users" />
          </Form>
          <section>

          </section>
        </aside>
        <main className="flex-1">
          <Outlet />
        </main>
      </section>
    </div>
  )
}