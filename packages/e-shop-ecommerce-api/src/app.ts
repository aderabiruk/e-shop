import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import moment from 'moment';
import bodyParser from "body-parser";
import compression from 'compression';
import { ApolloServer } from 'apollo-server-express';
import express, { Application, Request, Response } from 'express';

import routes from './routers';
import Schema from './typeDefs';
import Messages from './errors/Messages';
import { Error } from './errors/Errors';
import initializeDB from './utilities/database/mongoose';

/**
 * Initialize Express App
 */
const app: Application = express();

/**
 * Middleware
 */
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use('/public', express.static('public'));

/**
 * Initialize Database
 */
initializeDB();

/**
 * Initialize Routes
 */
routes(app);

/**
 * Global Error Handler
 */
app.use((error: any, request: Request, response: Response, next: Function) => {
    if (error instanceof Error) {
        response.status(error.statusCode).json(error.payload);
    }
    else {
        response.status(500).json({
            timestamp: moment(),
            errors: [
                Messages.INTERNAL_SERVER_ERROR
            ]
        });
    }
});

/**
 * Initialize GraphQL
 */
const apollo: ApolloServer = new ApolloServer({ schema : Schema });
apollo.applyMiddleware({ app });

export default app;