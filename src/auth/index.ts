import { Router } from '../lib/router';

const authRouter = new Router();

authRouter.get('/login', async (_, request) => {
	const url = new URL(request.url);
	console.log(url.searchParams);
	return new Response('success login');
});

export default authRouter;
