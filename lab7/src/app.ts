import * as express from 'express';
import { Request, Response } from 'express';
import { Pokemons } from './routes/pokemons';
var totalRequests: number = 0;

class App {
	public app: express.Application;
	public pokeRoutes: Pokemons = new Pokemons();

	constructor() {
		this.app = express();
		this.config();
		this.pokeRoutes.routes(this.app);
	}

	private middleware_01 = (req: Request, res: Response, next: Function) => {
		totalRequests++;

		//first middleware
		console.log("*********************");
		console.log(`There has been ${totalRequests} requests made to the site`);

		next();
	};

	private middleware_02 = (req: Request, res: Response, next: Function) => {
		//second middleware
		console.log("request body: ", req.body);
		console.log('request url path: ' + req.protocol + '://' + req.get('host') + req.originalUrl);
		console.log("request HTTP verb: ", req.method);

		next();
	};

	private middleware_03 = (req: Request, res: Response, next: Function) => {
		//third middleware
		const pathsAccessed = {};

		if (!pathsAccessed[req.path]) pathsAccessed[req.path] = 0;

		pathsAccessed[req.path]++;

		console.log(`There have now been ${pathsAccessed[req.path]} requests made to ${req.path}`);
		console.log("All of the requests:\n", pathsAccessed);
		console.log("*********************\n");
		
		next();
	};
	private config(): void {
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: false }));
		this.app.use(this.middleware_01);
		this.app.use(this.middleware_02);
		this.app.use(this.middleware_03);

	}
}

export default new App().app;
