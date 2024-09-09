import { Router } from './lib/router';

/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.toml`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
const router = new Router();

router.get('/:id', (params) => {
	return new Response(`Hello from worker ${params.id}`);
});

export default {
	fetch: router.listen,
} satisfies ExportedHandler<Env>;
