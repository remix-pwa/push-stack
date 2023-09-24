/// <reference lib="WebWorker" />

import { Storage } from "@remix-pwa/cache";
import { cacheFirst, networkFirst } from "@remix-pwa/strategy";
import type {
  DefaultFetchHandler,
  GetLoadContextFunction,
} from "@remix-pwa/sw";
import { RemixNavigationHandler, logger, matchRequest } from "@remix-pwa/sw";
import db from "./utils/worker/storage";
import type { GetLoadContextType } from "./utils/worker/types";

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

export const getLoadContext: GetLoadContextFunction = (event) => {
  const { connectivity } = db();

  return {
    fetchFromServer: async () => {
      const connectivityStatus = await connectivity
        .get(1)
        .then((data) => data?.status ?? "online");

      if (connectivityStatus === "offline") {
        return new Response(null, {
          status: 503,
          statusText: "Service Unavailable",
        });
      }

      return fetch(event.request);
    },
    setConnectivityStatus: async (status: string) => {
      await connectivity.put({ status, id: 1 });
    },
    getConnectivityStatus: async () => {
      const data = await connectivity.get(1);
      return data?.status ?? "online";
    },
    event,
  };
};

// The default fetch event handler will be invoke if the
// route is not matched by any of the worker action/loader.
export const defaultFetchHandler: DefaultFetchHandler = ({
  context,
  request,
}) => {
  const { fetchFromServer } = context as GetLoadContextType;
  const type = matchRequest(request);

  if (request.destination == "image") {
    console.log("image", request.url);
    // if (request.method.toLowerCase() === "get") {
    //   assetCache.put(request, new Response(null, { status: 202 }));
    // } else {
    //   assetCache
    //     .match(request, {
    //       ignoreSearch: true,
    //       ignoreVary: true,
    //     })
    //     .then((response) => {
    //       if (response) {
    //         assetCache.delete(request);
    //       }

    //       assetCache.put(request, new Response(null, { status: 202 }));
    //     });
    // }
  }

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
