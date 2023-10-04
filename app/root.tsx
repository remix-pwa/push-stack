import { json, type LinksFunction, type LoaderFunctionArgs } from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";

import tailwind from './tailwind.css';
import { LiveReload, useSWEffect } from "@remix-pwa/sw";
import { getTheme } from "./utils/server/theme.server";
import { ThemeProvider } from "./utils/providers/ThemeProvider";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: tailwind },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const theme = await getTheme(request);

  return json({ theme });
};

export default function App() {
  useSWEffect();
  const { theme } = useLoaderData<typeof loader>();

  return (
    <ThemeProvider ssr_theme={theme}>
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <Meta />
          <link rel="manifest" href="/manifest.webmanifest" />
          <Links />
        </head>
        <body className="dark:bg-slate-800">
          <Outlet />
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </body>
      </html>
    </ThemeProvider>
  );
}
