import { createCookieSessionStorage } from "@remix-run/node"; // or cloudflare/deno
import invariant from "tiny-invariant";
import type { Theme } from "../providers/ThemeProvider";

type SessionData = {
  userId: string;
  theme: Theme | null;
};

type SessionFlashData = {
  error: string;
  success: string;
  message: string;
};

const session_secret = process.env.SESSION_SECRET;
invariant(session_secret, "You must provide a SESSION_SECRET environment variable. Set it in .env");

export const { getSession, commitSession, destroySession } = createCookieSessionStorage<SessionData, SessionFlashData>({
  cookie: {
    name: "__session",
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 3, // 3 days - after all, this is for testing purposes
    path: "/",
    sameSite: "lax",
    secrets: [session_secret],
    secure: true
  }
});

/**
 * @description Set the theme for the user, returns the committed session to add to you "Set-Cookir" Header.
 *
 * @param request The request object from the loader/action
 * @param theme The theme to set for the user
 */
export const setTheme = async (request: Request, theme: Theme) => {
  let session = await getSession(request.headers.get("Cookie"));
  session.set("theme", theme);
  return await commitSession(session);
};

/**
 *
 * @param request The request object from the loader/action
 * @returns the user theme if it exists, null if it doesn't
 */
export const getTheme = async (request: Request) => {
  const session = await getSession(request.headers.get("Cookie"));
  return session.get("theme") || null;
};