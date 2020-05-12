import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import bodyParser from "body-parser";
import compression from 'compression';
import express, { Application } from 'express';

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

export default app;