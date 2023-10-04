import { redirect } from 'remix-typedjson';
import type { SessionData } from './session.server';
import { commitSession, destroySession, getCookieSession } from './session.server';
import { getUserById } from '../models/user.server';

const USER_SESSION_KEY: keyof SessionData = 'userId';

export const register = () => {}

export const logout = async (request: Request) => {
  const session = await getCookieSession(request);

  return redirect("/", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}

export const getUser = async (request: Request) => {
  const userId = await getUserId(request);
  if (userId === undefined) return null;

  const user = getUserById(Number(userId));
  if (user) return user;

  throw await logout(request);
}

export const getUserId = async (request: Request) => {
  const session = await getCookieSession(request);
  return session.get(USER_SESSION_KEY);
}

export const requireUserId = async (request: Request, redirectTo: string = new URL(request.url).pathname) => {
  const userId = await getUserId(request);

  if (!userId) {
    const redirectToParams = new URLSearchParams({ redirectTo });
    // By throwing this, we automatically overcome the
    // `workerLoader`.
    throw redirect(`/login?${redirectToParams.toString()}`);
  }

  return userId;
}

export const createUserSession = async ({
  request,
  userId,
  redirectTo,
}: {
  request: Request;
  userId: number;
  redirectTo: string;
}) => {
  const session = await getCookieSession(request);
  session.set(USER_SESSION_KEY, userId.toString());

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}
