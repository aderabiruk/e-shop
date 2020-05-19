import express, { Router } from 'express';

import CountryController from '../api/Country.controller';

let router: Router = express.Router();

router
    /**
     * Create Country
     */
    .post("/", CountryController.create)
    /**
     * Find All Categories
     */
    .get("/", CountryController.findAll)
    /**
     * Find Country By ID
     */
    .get("/:id", CountryController.findByID)
    /**
     * Update Country
     */
    .put("/:id", CountryController.update)
    /**
     * Delete Country
     */
    .delete("/:id", CountryController.delete);

export default router;