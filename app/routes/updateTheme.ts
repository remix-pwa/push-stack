import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "react-router-dom";
import { typedjson } from "remix-typedjson";
import { setTheme } from "~/utils/server/theme.server";

export const loader = () => {
  return redirect("/");
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const method = request.method.toLowerCase();

  if (method === "post") {
    const formData = await request.formData();
    const theme = formData.get("theme");
    if (theme === "dark") {
      const set_session = await setTheme(request, "dark");

      return typedjson(
        { response: "dark" },
        {
          status: 200,
          headers: {
            "Set-Cookie": set_session
          }
        }
      );
    }

    if (theme === "light") {
      const set_session = await setTheme(request, "light");

      return typedjson(
        { response: "light" },
        {
          status: 200,
          headers: {
            "Set-Cookie": set_session
          }
        }
      );
    }

    return typedjson({ response: "Invalid Theme" }, { status: 400 });
  }

  return typedjson({ response: "Invalid Method" }, { status: 405 });
};