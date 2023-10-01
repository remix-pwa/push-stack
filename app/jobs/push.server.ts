import { eventTrigger } from "@trigger.dev/sdk";
import { client } from "~/utils/server/trigger.server";

// all jobs here have an id of: '*-push-job'
// for consistency-sake

export const pushToUser = client.defineJob({
  // This is the unique identifier for your Job, it must be unique across all Jobs in your project
  id: "send-push-job",
  name: "Push Job: Send a push notification to a user",
  version: "0.0.1",
  // This is triggered by an event using eventTrigger. You can also trigger Jobs with webhooks, on schedules, and more: https://trigger.dev/docs/documentation/concepts/triggers/introduction
  trigger: eventTrigger({
    name: "push.user",
  }),
  run: async (payload, io, ctx) => {
    await io.logger.info(`Action was ${payload.action}`);

    console.log("Sending push notification");
    console.log(payload, 'payload');
  },
});
