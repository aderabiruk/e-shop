import evalidate from 'evalidate';
import validator from 'validator';
import { Request, Response } from 'express';

import Messages from '../errors/Messages';
import { IProduct } from "../models/Product";
import ProductService from "../services/Product.service";
import { IPaginationResponse } from '../utilities/adapters/Pagination';
import ImagePathResolver, { ImagePath } from '../utilities/image/ImagePathResolver';
import { Error, BadRequestError, NotFoundError, NotImplementedError } from '../errors/Errors';

class ProductController {

    /**
     * Create Product
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static async create(request: Request, response: Response) {
        const Schema = new evalidate.schema({
            name: evalidate.string().required(Messages.PRODUCT_NAME_REQUIRED),
            price: evalidate.string().numeric().required(Messages.PRODUCT_PRICE_REQUIRED),
            quantity: evalidate.string().numeric().required(Messages.PRODUCT_QUANTITY_REQUIRED),
            category: evalidate.string().required(Messages.PRODUCT_CATEOGRY_REQUIRED),
            store: evalidate.string().required(Messages.PRODUCT_STORE_REQUIRED),
            weight: evalidate.string().numeric().required(Messages.PRODUCT_WEIGHT_REQUIRED),
            width: evalidate.string().numeric().required(Messages.PRODUCT_WIDTH_REQUIRED),
            length: evalidate.string().numeric().required(Messages.PRODUCT_LENGTH_REQUIRED),
            height: evalidate.string().numeric().required(Messages.PRODUCT_HEIGHT_REQUIRED),
        });
        const result = Schema.validate(request.body);
        if (result.isValid) {
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
        else {
            let error = new BadRequestError(result.errors);
            response.status(error.statusCode).json(error.payload);
        }
    }

    /**
     * Find All Products
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static findAll(request: Request, response: Response) {
        let query: string = request.query.q ? request.query.q.toString() : "";
        let page: number = request.query.page && validator.isInt(request.query.page.toString()) ? parseInt(request.query.page.toString()) : 1;
        let limit: number = request.query.limit && validator.isInt(request.query.limit.toString()) ? parseInt(request.query.limit.toString()) : 25;

        ProductService.findAll(query, page, limit)
            .then((result: IPaginationResponse) => {
                response.json(result);
            })
            .catch((error: Error) => {
                response.status(error.statusCode).json(error.payload);
            });
    }

    /**
     * Find Products By Store
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static findByStore(request: Request, response: Response) {
        let page: number = request.query.page && validator.isInt(request.query.page.toString()) ? parseInt(request.query.page.toString()) : 1;
        let limit: number = request.query.limit && validator.isInt(request.query.limit.toString()) ? parseInt(request.query.limit.toString()) : 25;

        ProductService.findByStore(request.params.id, page, limit)
            .then((result: IPaginationResponse) => {
                response.json(result);
            })
            .catch((error: Error) => {
                response.status(error.statusCode).json(error.payload);
            });
    }

    /**
     * Find Products By Category
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static findByCategory(request: Request, response: Response) {
        let page: number = request.query.page && validator.isInt(request.query.page.toString()) ? parseInt(request.query.page.toString()) : 1;
        let limit: number = request.query.limit && validator.isInt(request.query.limit.toString()) ? parseInt(request.query.limit.toString()) : 25;

        ProductService.findByCategory(request.params.id, page, limit)
            .then((result: IPaginationResponse) => {
                response.json(result);
            })
            .catch((error: Error) => {
                response.status(error.statusCode).json(error.payload);
            });
    }

    /**
     * Find Product By ID
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static findByID(request: Request, response: Response) {
        ProductService.findByID(request.params.id)
            .then((product: IProduct) => {
                if (product) {
                    response.json(product);
                }
                else {
                    let error: Error = new NotFoundError(Messages.STORE_NOT_FOUND);
                    response.status(error.statusCode).json(error.payload);
                }
                
            })
            .catch((error: Error) => {
                response.status(error.statusCode).json(error.payload);
            });
    }

    /**
     * Update Product
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static update(request: Request, response: Response) {
        ProductService.update(request.params.id, request.body)
            .then((product: IProduct) => {
                response.json(product);
            })
            .catch((error: Error) => {
                response.status(error.statusCode).json(error.payload);
            });
    }

    /**
     * Delete Store
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static delete(request: Request, response: Response) {
        let error: Error = new NotImplementedError();
        response.status(error.statusCode).json(error.payload);
    }
}

export default ProductController;