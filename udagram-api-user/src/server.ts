import cors from 'cors';
import express, { Request, Response, Express, NextFunction } from 'express';
import { sequelize } from './sequelize';

import { IndexRouter } from './controllers/v0/index.router';

import { config } from './config/config';
import { V0_USER_MODELS } from './controllers/v0/model.index';

(async () => {
	await sequelize.addModels(V0_USER_MODELS);

	console.debug('Initialize database connection...');
	await sequelize.sync();

	const app: Express = express();
	const port = process.env.PORT || 8080;

	app.use(express.json());

	// We set the CORS origin to * so that we don't need to
	// worry about the complexities of CORS this lesson. It's
	// something that will be covered in the next course.
	app.use(
		cors({
			allowedHeaders: [
				'Origin',
				'X-Requested-With',
				'Content-Type',
				'Accept',
				'X-Access-Token',
				'Authorization',
			],
			methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
			preflightContinue: true,
			origin: '*',
		})
	);

	//add request logging
	app.use((req: Request, res: Response, next: NextFunction) => {
		console.log(`${req.method} ${req.url} ${Date.now().toLocaleString()} `);
	});

	app.use('/api/v0/', IndexRouter);

	// Root URI call
	app.get('/', async (req: Request, res: Response) => {
		res.send('/api/v0/');
	});

	app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
		console.error(err.stack);
		return res.status(500).json({
			message: 'Internal error',
		});
	});

	// Start the Server
	app.listen(port, () => {
		console.log(`server running ${config.url}`);
		console.log(`press CTRL+C to stop server`);
	});
})();
