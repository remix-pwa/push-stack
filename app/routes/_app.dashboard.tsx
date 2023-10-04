import { getPushSubscriptionStatus, subscribeToPush, getSubscriptionData } from "@remix-pwa/push/worker";
import { logger } from "@remix-pwa/sw";
import { json } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { Form, Link, Outlet, useFetcher, useLoaderData, useLocation } from "@remix-run/react";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Input } from "~/components/ui/input";
import { prisma } from "~/utils/server/db.server";
import { requireUserId } from "~/utils/server/user.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await requireUserId(request);

  const currentUserDevices = await prisma.device.findMany({
    where: {
      userId: Number(user),
    },
    select: {
      endpoint: true,
    }
  });

  const allUsers = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      image: true,
      createdAt: true,
      updatedAt: true,
    },
    where: {
      id: {
        not: Number(user),
      }
    }
  });

  return json({
    allUsers,
    currentUser: user,
    currentUserDevices,
  });
}

export const User = ({
  name,
  avatar,
  email,
  id,
}: {
  name: string;
  avatar: string | undefined;
  email: string;
  id: number;
}) => {
  return (
    <Link to={`/dashboard/${id}`} className="flex items-center p-2 rounded-sm cursor-pointer hover:bg-slate-200">
      <Avatar className="h-9 w-9">
        <AvatarImage src={avatar ?? ''} alt="Avatar" />
        <AvatarFallback>{name.slice(0,2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="ml-4 space-y-1">
        <p className="text-sm font-medium leading-none">{name}</p>
        <p className="text-sm text-muted-foreground">
          {email}
        </p>
      </div>
    </Link>
  )
}

export default function DashboardLayout() {
  const data = useLoaderData<typeof loader>();
  const location = useLocation();
  const fetcher = useFetcher();

  const [filteredUsers, setFilteredUsers] = useState<typeof data.allUsers>(data.allUsers);

  const search = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value === '') {
      setFilteredUsers(data.allUsers);
      return;
    }

    const filtered = data.allUsers.filter((user) => {
      return user.username.toLowerCase().includes(value.toLowerCase());
    });

    setFilteredUsers(filtered);
  }

  // Move this to `createUserSession`
  useEffect(() => {
    if (typeof window === 'undefined') return;

    (async () => {
      const pushSubscriptionStatus = await getPushSubscriptionStatus();

      if (!pushSubscriptionStatus) {
        logger.log('subscribing to push');

        await subscribeToPush(
          'BHdNRbVHaSS77klpV70lO7ZbS1MGbYhSpKGT6_m-aB_kwEB8t9R9pLWwZJcjUKTGzbjw4Uy7CEWt2uZU5aTn6OA'
        );
      }

      let subscriptionData = await getSubscriptionData() as PushSubscription;

      logger.info('Subscribed to push notifications already');

      if (!subscriptionData) {
        logger.error('Subscription data is null');
        return;
      }

      const deviceRegistered = data.currentUserDevices.filter((device) => {
        return device.endpoint === subscriptionData.endpoint;
      });

      if (deviceRegistered.length === 0) {
        logger.info('Registering device');

        fetcher.submit({
          type: 'register-device',
          userId: data.currentUser!,
          auth: subscriptionData.toJSON().keys!.auth,
          p256dh: subscriptionData.toJSON().keys!.p256dh,
          endpoint: subscriptionData.toJSON().endpoint!,
        }, {
          action: '/push',
          method: 'POST',
        })
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.currentUserDevices]);

  return (
    <div className="flex flex-col w-full h-screen">
      <header className="flex content-center justify-between w-full h-16 shadow-md">
        <section className="flex items-center content-center">
          <h3>Push Stack</h3>
        </section>
      </header>
      <section className="flex w-full h-full">
        <aside className={`${location.pathname === '/dashboard' ? 'block' : 'hidden sm:block'} w-full border-r sm:max-w-xs border-r-slate-500`}>
          <Form className="p-2 mb-5">
            <Input placeholder="Search Users" className="outline-none ring-0" onChange={(e) => search(e)} />
          </Form>
          <section className="space-y-6">
            {
              filteredUsers.map(user => (
                <User
                  key={user.id}
                  //@ts-ignore
                  id={user.id}
                  name={user.username}
                  email={user.email}
                  avatar={user.image ?? undefined}
                />
              ))
            }
          </section>
        </aside>
        <main className={`${location.pathname === '/dashboard' ? 'hidden sm:flex' : 'flex'} sm:flex-1 w-full`}>
          <Outlet />
        </main>
      </section>
    </div>
  )
}