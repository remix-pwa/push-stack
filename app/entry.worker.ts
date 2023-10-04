/// <reference lib="WebWorker" />

import { Storage } from "@remix-pwa/cache";
import { Push } from "@remix-pwa/push/worker";
import { cacheFirst, networkFirst } from "@remix-pwa/strategy";
import type { DefaultFetchHandler } from "@remix-pwa/sw";
import { RemixNavigationHandler, logger, matchRequest } from "@remix-pwa/sw";

declare let self: ServiceWorkerGlobalScope;

const PAGES = "page-cache";
const DATA = "data-cache";
const ASSETS = "assets-cache";

// Open the caches and wrap them in `RemixCache` instances.
const dataCache = Storage.open(DATA, {
  ttl: 60 * 60 * 24 * 7 * 1_000, // 7 days
});
const documentCache = Storage.open(PAGES);
const assetCache = Storage.open(ASSETS);

self.addEventListener("install", (event: ExtendableEvent) => {
  logger.log("Service worker installed");
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event: ExtendableEvent) => {
  logger.log("Service worker activated");
  event.waitUntil(self.clients.claim());
});

const dataHandler = networkFirst({
  cache: dataCache,
  cacheQueryOptions: {
    ignoreSearch: false,
  },
});

const assetsHandler = cacheFirst({
  cache: assetCache,
  cacheQueryOptions: {
    ignoreSearch: true,
    ignoreVary: true,
  },
});

// The default fetch event handler will be invoke if the
// route is not matched by any of the worker action/loader.
export const defaultFetchHandler: DefaultFetchHandler = ({
  context,
  request,
}) => {
  const { fetchFromServer } = context;
  const type = matchRequest(request);

  if (type === "asset") {
    return assetsHandler(context.event.request);
  }

  if (type === "loader") {
    return dataHandler(context.event.request);
  }

  return fetchFromServer();
};

const handler = new RemixNavigationHandler({
  dataCache,
  documentCache,
});

self.addEventListener("message", (event) => {
  event.waitUntil(handler.handle(event));
});

class CustomPush extends Push {
  async handlePush(event: PushEvent): Promise<void> {
    const { data } = event;
    console.log(data?.json(), 'data');
    await self.registration.showNotification(data?.json().title, data?.json().options);
  }

  async handleNotificationClick(event: NotificationEvent): Promise<void> {}

  async handleNotificationClose(event: NotificationEvent): Promise<void> {}

  async handleError(error: ErrorEvent): Promise<void> {}
}

const pushHandler = new CustomPush();

self.addEventListener("push", (event: PushEvent) => {
  event.waitUntil(pushHandler.handlePush(event));
});

self.addEventListener("notificationclick", (event: NotificationEvent) => {});

self.addEventListener("notificationclose", (event: NotificationEvent) => {});

self.addEventListener("error", (error: ErrorEvent) => {});