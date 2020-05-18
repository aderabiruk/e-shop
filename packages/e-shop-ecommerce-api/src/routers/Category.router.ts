import express, { Router } from 'express';

import CategoryController from '../api/Category.controller';

let router: Router = express.Router();

router
    /**
     * Create Category
     */
    .post("/", CategoryController.create)
    /**
     * Find All Categories
     */
    .get("/", CategoryController.findAll)
    /**
     * Find All Parent Categories
     */
    .get("/parents", CategoryController.findParents)
    /**
     * Find Category By ID
     */
    .get("/:id", CategoryController.findByID)
    /**
     * Find Subcategories
     */
    .get("/:id/subcategories", CategoryController.findSubcategories)
    /**
     * Update Category
     */
    .put("/:id", CategoryController.update)
    /**
     * Delete Category
     */
    .delete("/:id", CategoryController.delete);

export default router;