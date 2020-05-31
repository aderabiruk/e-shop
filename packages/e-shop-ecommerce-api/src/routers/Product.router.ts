import express, { Router } from 'express';

import upload from '../middlewares/upload/UploadImage';
import ProductController from '../api/Product.controller';
import { resize } from '../middlewares/image/ImageProcessor';

let router: Router = express.Router();

router
    /**
     * Create Product
     */
    .post("/", upload.array("images", 10), resize, ProductController.create);

export default router;