/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/")) {
      // TODO: Add your custom /api/* logic here.
      return new Response("Ok");
    }
    // Passes the incoming request through to the assets binding.
    // No asset matched this request, so this will evaluate `not_found_handling` behavior.
    return env.ASSETS.fetch(request);
  },
};
