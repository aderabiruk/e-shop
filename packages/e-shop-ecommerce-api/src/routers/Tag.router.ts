import express, { Router } from 'express';

import TagController from '../api/Tag.controller';

let router: Router = express.Router();

router
    /**
     * Create Tag
     */
    .post("/", TagController.create)
    /**
     * Find All Tags
     */
    .get("/", TagController.findAll)
    /**
     * Find Tag By ID
     */
    .get("/:id", TagController.findByID)
    /**
     * Update Tag
     */
    .put("/:id", TagController.update)
    /**
     * Delete Tag
     */
    .delete("/:id", TagController.delete);

export default router;