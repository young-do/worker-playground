// inspired by https://github.com/jrf0110/8track

type RouteHandler = ExportedHandlerFetchHandler<Env, unknown>;
type Route = [string, RouteHandler];
type ErrorHandler = (error: unknown) => Response;

export class Router {
	routes: Record<string, Route[]> = {
		GET: [],
		POST: [],
		PUT: [],
		DELETE: [],
		PATCH: [],
		OPTIONS: [],
	};
	errorHandler: ErrorHandler = (error) => {
		const errorMessage = error instanceof Error ? error.message : 'Unknown Error';
		return new Response(errorMessage, { status: 500 });
	};

	before(handler: RouteHandler) {
		// Do something before the request is handled
	}

	get(path: string, handler: RouteHandler) {
		this.routes['GET'].push([path, handler]);
	}

	post(path: string, handler: RouteHandler) {
		this.routes['POST'].push([path, handler]);
	}

	put(path: string, handler: RouteHandler) {
		this.routes['PUT'].push([path, handler]);
	}

	delete(path: string, handler: RouteHandler) {
		this.routes['DELETE'].push([path, handler]);
	}

	patch(path: string, handler: RouteHandler) {
		this.routes['PATCH'].push([path, handler]);
	}

	options(path: string, handler: RouteHandler) {
		this.routes['OPTIONS'].push([path, handler]);
	}

	catch(errorHandler: ErrorHandler) {
		this.errorHandler = errorHandler;
	}

	listen: ExportedHandlerFetchHandler<Env, unknown> = async (...args) => {
		const [request] = args;
		const url = new URL(request.url);
		const method = request.method;
		const routes = this.routes[method] ?? [];

		for (const [path, handler] of routes) {
			if (url.pathname === path) {
				try {
					return await handler(...args);
				} catch (error) {
					return this.errorHandler(error);
				}
			}
		}

		return new Response('Not Found', { status: 404 });
	};
}
