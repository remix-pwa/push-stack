/** @type {import('@remix-pwa/dev').WorkerConfig} */
module.exports = {
  ignoredRouteFiles: ["**/.*"],
  tailwind: true,
  serverDependenciesToBundle: [
    /@remix-pwa\/.*/,
    "bcryptjs",
    "@epic-web/remember",
    "chalk",
    "ansi-styles",
    "#ansi-styles",
    '#supports-color',
  ],
  serverModuleFormat: "cjs",
  browserNodeBuiltinsPolyfill: {
    modules: {
      crypto: true,
    }
  },
  serverNodeBuiltinsPolyfill: true  
};
