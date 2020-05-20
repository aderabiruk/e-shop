import { Application } from 'express';

import CategoryRouter from './Category.router';
import CityRouter from './City.router';
import CountryRouter from './Country.router';
import StoreRouter from './Store.router';
import TagRouter from './Tag.router';

let routes = (app: Application) => {
    app.use("/api/categories", CategoryRouter);
    app.use("/api/cities", CityRouter);
    app.use("/api/countries", CountryRouter);
    app.use("/api/stores", StoreRouter);
    app.use("/api/tags", TagRouter);
};

export default routes;