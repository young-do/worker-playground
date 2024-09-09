// inspired by https://github.com/jrf0110/8track

import { match } from 'path-to-regexp';

type ExtractRouteParams<T extends string> = string extends T
	? Record<string, string>
	: T extends `${infer _Start}:${infer Param}/${infer Rest}`
	? { [K in Param | keyof ExtractRouteParams<Rest>]: string }
	: T extends `${infer _Start}:${infer Param}`
	? { [K in Param]: string }
	: {};

type RouteHandler<Path extends string> = <CfHostMetadata = unknown>(
	params: ExtractRouteParams<Path>,
	request: Request<CfHostMetadata, IncomingRequestCfProperties<CfHostMetadata>>,
	env: Env,
	ctx: ExecutionContext
) => Response | Promise<Response>;
type Route<T extends string> = [T, RouteHandler<T>];
type ErrorHandler = (error: unknown) => Response;

export class Router {
	// @hack
	routes: Record<any, Route<any>[]> = {
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

	before(handler: RouteHandler<string>) {
		// Do something before the request is handled
	}

	get<T extends string>(path: T, handler: RouteHandler<T>) {
		this.routes['GET'].push([path, handler]);
	}

	post<T extends string>(path: T, handler: RouteHandler<T>) {
		this.routes['POST'].push([path, handler]);
	}

	put<T extends string>(path: T, handler: RouteHandler<T>) {
		this.routes['PUT'].push([path, handler]);
	}

	delete<T extends string>(path: T, handler: RouteHandler<T>) {
		this.routes['DELETE'].push([path, handler]);
	}

	patch<T extends string>(path: T, handler: RouteHandler<T>) {
		this.routes['PATCH'].push([path, handler]);
	}

	options<T extends string>(path: T, handler: RouteHandler<T>) {
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

		try {
			for (const [path, handler] of routes) {
				const result = match(path)(url.pathname);
				if (result !== false) {
					// @hack
					return await handler(result.params as any, ...args);
				}
			}
		} catch (error) {
			return this.errorHandler(error);
		}

		return new Response('Not Found', { status: 404 });
	};
}
