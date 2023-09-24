import { flatRoutes } from 'remix-flat-routes';

/** @type {import('@remix-pwa/dev').WorkerConfig} */
export default {
  ignoredRouteFiles: ["**/.*"],
  tailwind: true,
  serverDependenciesToBundle: [
    /@remix-pwa\/.*/
  ],
  routes: async defineRoutes => {
    return flatRoutes('routes', defineRoutes)
  },
};
