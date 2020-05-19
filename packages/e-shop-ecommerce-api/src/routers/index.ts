import { Application } from 'express';

import CategoryRouter from './Category.router';
import CountryRouter from './Country.router';

let routes = (app: Application) => {
    app.use("/api/categories", CategoryRouter);
    app.use("/api/countries", CountryRouter);
};

export default routes;