import express, { Router } from 'express';

import CityController from '../api/City.controller';

let router: Router = express.Router();

router
    /**
     * Create City
     */
    .post("/", CityController.create)
    /**
     * Find All Cities
     */
    .get("/", CityController.findAll)
    /**
     * Find Cities By Country
     */
    .get("/country/:id", CityController.findByCountry)
    /**
     * Find By Location
     */
    .post("/location", CityController.findByLocation)
    /**
     * Find City By ID
     */
    .get("/:id", CityController.findByID)
    /**
     * Update City
     */
    .put("/:id", CityController.update)
    /**
     * Delete Category
     */
    .delete("/:id", CityController.delete);

export default router;