import { type WorkerActionArgs } from "@remix-pwa/sw";
import type { ActionFunctionArgs } from "@remix-run/node";
import { registerUserDevice } from "~/utils/models/device.server";
import { client } from "~/utils/server/trigger.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  console.log("Sending push notification");
  const data = await request.formData();

  const type = data.get("type");

  switch (type) {
    case "send-push":
      console.log("Sending push notification");

      // await client.sendEvent({
      //   name: "push.user",
      //   payload: {
      //     action: "send-push",
      //     userId: data.get("userId"),
      //   },
      // })
      break;
    case "register-device":
      const userId = data.get("userId") as string;
      const auth = data.get("auth") as string;
      const endpoint = data.get("endpoint") as string;
      const p256dh = data.get("p256dh") as string;
      const platform = data.get("platform") as any;
      const mobile = data.get("mobile") as any;

      console.log({ userId, auth, endpoint, p256dh, platform, mobile });

      registerUserDevice(Number(userId), {
        auth,
        endpoint,
        mobile: Boolean(mobile),
        p256dh,
        platform,
      });
      break;
    default:
      console.error("Unknown action");
      break;
  }

  return null;
};

export const workerAction = async ({ context }: WorkerActionArgs) => {
  const { fetchFromServer } = context;

  try {
    await fetchFromServer();
    console.log("Fetch Happened");
  } catch (error) {
    console.log("Fetch Failed");
  }

  return null;
};
