import express, { Router } from 'express';

import StoreController from '../api/Store.controller';

let router: Router = express.Router();

router
    /**
     * Create Store
     */
    .post("/", StoreController.create)
    /**
     * Find All Stores
     */
    .get("/", StoreController.findAll)
    /**
     * Find Stores By City
     */
    .get("/city/:id", StoreController.findByCity)
    /**
     * Find Stores By Location
     */
    .post("/location", StoreController.findByLocation)
    /**
     * Find Store By ID
     */
    .get("/:id", StoreController.findByID)
    /**
     * Update Store
     */
    .put("/:id", StoreController.update)
    /**
     * Delete Store
     */
    .delete("/:id", StoreController.delete);

export default router;