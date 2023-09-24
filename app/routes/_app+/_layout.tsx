import type { WorkerActionArgs, WorkerLoaderArgs } from "@remix-pwa/sw";
import { Form, Outlet, useLoaderData } from "@remix-run/react";
import { useEffect } from "react";
import { typedjson } from "remix-typedjson";
import { Input } from "~/components/ui/input";
import type { GetLoadContextType } from "~/utils/worker/types";

export const workerAction = async ({ context }: WorkerActionArgs) => {
  const { getConnectivityStatus } = context as GetLoadContextType;

  console.log(await getConnectivityStatus());

  return null;
}

export const loader = async () => {
  return null;
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
  // const data = useLoaderData<typeof workerLoader>();

  // useEffect(() => {
  //   setInterval(() => {
  //     console.log(data);
  //   }, 5_000);
  // }, []);

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