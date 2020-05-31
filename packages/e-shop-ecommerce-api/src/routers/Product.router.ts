import express, { Router } from 'express';

import upload from '../middlewares/upload/UploadImage';
import ProductController from '../api/Product.controller';
import { resize } from '../middlewares/image/ImageProcessor';

let router: Router = express.Router();

router
    /**
     * Create Product
     */
    .post("/", upload.array("images", 10), resize, ProductController.create)
    /**
     * Find All Products
     */
    .get("/", ProductController.findAll)
    /**
     * Find Products By Store
     */
    .get("/store/:id", ProductController.findByStore)
    /**
     * Find Products By Category
     */
    .get("/category/:id", ProductController.findByCategory)
    /**
     * Find Product By Id
     */
    .get("/:id", ProductController.findByID)
    /**
     * Update Product
     */
    .put("/:id", ProductController.update)
    /**
     * Delete Product
     */
    .delete("/:id", ProductController.delete);

export default router;