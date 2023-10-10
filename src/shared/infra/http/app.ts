import 'reflect-metadata';
import 'dotenv/config';
import cors from 'cors';
import express, { NextFunction, Response, Request } from 'express';
import 'express-async-errors';
import swaggerUI from 'swagger-ui-express';

import '../../container';
import { AppError } from '../../errors/AppError';
import createConnection from '../typeorm';

import swaggerFile from '../../../swagger.json';
import upload from '../../../config/upload';
import { router } from './routes';

createConnection();
const app = express();

app.use(express.json());

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerFile));

app.use('/avatar', express.static(`${upload.tmpFolder}/avatar`));
app.use('/cars', express.static(`${upload.tmpFolder}/cars`));

app.use(
    cors({
        origin: '*',
    }),
);
app.use(router);

app.use(
    (err: Error, request: Request, response: Response, next: NextFunction) => {
        if (err instanceof AppError) {
            return response.status(err.statusCode).json({
                message: err.message,
            });
        }

        return response.status(500).json({
            status: 'error',
            message: `Internal server error - ${err.message}`,
        });
    },
);

export { app };
