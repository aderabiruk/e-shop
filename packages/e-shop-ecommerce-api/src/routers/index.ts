import { Application } from 'express';

import CategoryRouter from './Category.router';

let routes = (app: Application) => {
    app.use("/api/categories", CategoryRouter);
};

export default routes;