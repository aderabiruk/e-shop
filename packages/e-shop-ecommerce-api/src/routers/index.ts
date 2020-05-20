import { Application } from 'express';

import CategoryRouter from './Category.router';
import CityRouter from './City.router';
import CountryRouter from './Country.router';

let routes = (app: Application) => {
    app.use("/api/categories", CategoryRouter);
    app.use("/api/cities", CityRouter);
    app.use("/api/countries", CountryRouter);
};

export default routes;