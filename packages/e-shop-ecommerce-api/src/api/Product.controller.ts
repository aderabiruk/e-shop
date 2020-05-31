import { Request, Response } from 'express';

import { IProduct } from "../models/Product";
import ProductService from "../services/Product.service";
import ImagePathResolver, { ImagePath } from '../utilities/image/ImagePathResolver';

class ProductController {

    /**
     * Create Product
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static async create(request: Request, response: Response) {
        let image_urls: ImagePath[] = await ImagePathResolver(request.files);

        ProductService.create(request.body.name, request.body.price, request.body.quantity, 
            request.body.description, image_urls, request.body.category, request.body.store, 
            request.body.tags, request.body.weight, request.body.width, request.body.length, request.body.height, request.body.is_visible)
            .then((product: IProduct) => {
                response.json(product);
            })
            .catch((error: any) => {
                response.status(error.statusCode).json(error.payload);
            });
    }
}

export default ProductController;