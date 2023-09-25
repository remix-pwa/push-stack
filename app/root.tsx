import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { typedjson } from "remix-typedjson";

import tailwind from './tailwind.css';
import { LiveReload, useSWEffect } from "@remix-pwa/sw";
import { getTheme } from "./utils/server/theme.server";
import { ThemeProvider } from "./utils/providers/ThemeProvider";
import { useEffect } from "react";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: tailwind },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const theme = await getTheme(request);

  return typedjson({ theme });
};

export default function App() {
  useSWEffect();
  const { theme } = useLoaderData<typeof loader>();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    console.log(window.__remixContext);
  })

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
