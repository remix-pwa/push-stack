import type { Theme } from "../providers/ThemeProvider";
import { commitSession, getSession } from "./session.server";

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