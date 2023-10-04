import { Label } from "@radix-ui/react-label";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node"
import { useFetcher, useLoaderData } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { getAllUserDevices } from "~/utils/models/device.server";
import { getUserById } from "~/utils/models/user.server"
import { requireUserId } from "~/utils/server/user.server";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const recepientUser = await getUserById(Number(params.slug));
  const recepientUserDevices = await getAllUserDevices(Number(params.slug));

  const currentUser = await requireUserId(request);

  return json({
    currentUser,
    recepientUser,
    recepientUserDevices,
  });
}

export default function UserPage() {
  const { recepientUser, currentUser } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  const sendPush = async () => {
    fetcher.submit({
      type: 'send-push',

      /* this section has to do with your current user */
      userId: currentUser!,

      /* This section deals with the recepient */
      recepientId: location.pathname.split('/')[2],

      /* This section deal with the notification itself */
      pushData: JSON.stringify({
        title: 'Hello World!',
        options: {
          body: 'This is a test notification from Remix PWA!',
        }
      })
    }, {
      action: '/push',
      method: 'POST',
    })
  };

  return (
    <div className="flex flex-col content-center w-full">
      <div className="flex flex-col w-full px-6 py-8 sm:flex-row">
        <section className="flex flex-col sm:flex-row sm:justify-center sm:content-center sm:items-center">
          <img src="https://th.bing.com/th/id/OIP.YjJSBQVO5Cy9RBxwNqfj7AHaJ5?pid=ImgDet&rs=1" alt="" className="content-center w-24 h-24 mx-auto mb-4 rounded-full sm:w-16 sm:h-16 lg:h-24 lg:w-24 sm:mb-0 bg-slate-500" />
        </section>
        <section className="flex flex-col items-center justify-center w-full px-4 sm:items-start sm:h-24">
          <p className="text-lg font-medium md:text-xl">{recepientUser?.username}</p>
          <p className="text-sm md:text-base text-slate-500 dark:text-slate-400">{recepientUser?.email}</p>
        </section>
      </div>
      <main className="flex justify-center w-full sm:mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Send a Push Notification</CardTitle>
            <CardDescription>
              Enter the parameters for your push notification and send away!
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="subject">Title</Label>
              <Input id="subject" placeholder="Notification title" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Body</Label>
              <Textarea
                id="description"
                placeholder="The main body of the notification. Make it count!"
              />
            </div>
          </CardContent>
          <CardFooter className="justify-end space-x-2">
            <Button onClick={() => {
              sendPush();
            }}>Send Push</Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}