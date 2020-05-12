import config from "config";
import mongoose from 'mongoose';

import logger from "../loggers/winston";

export default () => {
    let dbHost: string = config.get("database.host");
    let dbPort: string = config.get("database.port");
    let dbName: string = config.get("database.name");

    let dbUrl: string = process.env.MONGODB_URI || `mongodb://${dbHost}:${dbPort}/${dbName}`;
    
    mongoose.connect(dbUrl, {useUnifiedTopology: true, useNewUrlParser: true});
    mongoose.connection.on('connected', () => {
        logger.info(`Database connection established with ${dbUrl}`);
    });
    
    mongoose.connection.on('error', (error) => {
        logger.error(`Database connection error: ${error}`);
    });
    
    mongoose.connection.on('disconnected', () => {
        logger.info('Database connection terminated.');
    });
};

