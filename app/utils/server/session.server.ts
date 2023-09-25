import { createCookieSessionStorage } from "@remix-run/node"; // or cloudflare/deno
import invariant from "tiny-invariant";
import type { Theme } from "../providers/ThemeProvider";

// This is the type of data that will be stored in the session
// can be extended to include whatever you want.
export type SessionData = {
  userId: string;
  theme: Theme | null;
};

export type SessionFlashData = {
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
 * A utility function to assist with getting the current
 * session data from the request headers.
 */
export async function getCookieSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return getSession(cookie);
}