import authRouter from './auth';
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
const rootRouter = new Router();

rootRouter.merge(authRouter, '/auth');

rootRouter.get('/:id', (params) => {
	return new Response(`Hello from worker ${params.id}`);
});

export default {
	fetch: rootRouter.listen,
} satisfies ExportedHandler<Env>;
