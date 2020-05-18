import validator from 'validator';
import { Request, Response } from 'express';

import Messages from '../errors/Messages';
import { ICategory } from '../models/Category';
import CategoryService from '../services/Category.service';
import { IPaginationResponse } from '../utilities/adapters/Pagination';
import { Error, NotFoundError, NotImplementedError } from '../errors/Errors';

class CategoryController {

    /**
     * Create Category
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static create(request: Request, response: Response) {
        CategoryService.create(request.body.name, request.body.parent, request.body.image_url, request.body.description)
            .then((category: ICategory) => {
                response.json(category);
            })
            .catch((error: Error) => {
                response.status(error.statusCode).json(error.payload);
            });
    }

    /**
     * Find All Categories
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static findAll(request: Request, response: Response) {
        let query: string = request.query.q ? request.query.q.toString() : "";
        let page: number = request.query.page && validator.isInt(request.query.page.toString()) ? parseInt(request.query.page.toString()) : 1;
        let limit: number = request.query.limit && validator.isInt(request.query.limit.toString()) ? parseInt(request.query.limit.toString()) : 25;

        CategoryService.findAll(query, page, limit)
            .then((result: IPaginationResponse) => {
                response.json(result);
            })
            .catch((error: Error) => {
                response.status(error.statusCode).json(error.payload);
            });
    }

    /**
     * Find Parent Categories
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static findParents(request: Request, response: Response) {
        let page: number = request.query.page && validator.isInt(request.query.page.toString()) ? parseInt(request.query.page.toString()) : 1;
        let limit: number = request.query.limit && validator.isInt(request.query.limit.toString()) ? parseInt(request.query.limit.toString()) : 25;

        CategoryService.findParents(page, limit)
            .then((result: IPaginationResponse) => {
                response.json(result);
            })
            .catch((error: Error) => {
                response.status(error.statusCode).json(error.payload);
            });
    }

    /**
     * Find Subcategories
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static findSubcategories(request: Request, response: Response) {
        let page: number = request.query.page && validator.isInt(request.query.page.toString()) ? parseInt(request.query.page.toString()) : 1;
        let limit: number = request.query.limit && validator.isInt(request.query.limit.toString()) ? parseInt(request.query.limit.toString()) : 25;

        CategoryService.findSubcategories(request.params.id ,page, limit)
            .then((result: IPaginationResponse) => {
                response.json(result);
            })
            .catch((error: Error) => {
                response.status(error.statusCode).json(error.payload);
            });
    }

    /**
     * Find Category By ID
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static findByID(request: Request, response: Response) {
        CategoryService.findByID(request.params.id)
            .then((category: ICategory) => {
                if (category) {
                    response.json(category);
                }
                else {
                    let error: Error = new NotFoundError(Messages.CATEGORY_NOT_FOUND);
                    response.status(error.statusCode).json(error.payload);
                }
                
            })
            .catch((error: Error) => {
                response.status(error.statusCode).json(error.payload);
            });
    }

    /**
     * Update Category
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static update(request: Request, response: Response) {
        CategoryService.update(request.params.id, request.body)
            .then((category: ICategory) => {
                response.json(category);
            })
            .catch((error: Error) => {
                response.status(error.statusCode).json(error.payload);
            });
    }

    /**
     * Delete Category
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static delete(request: Request, response: Response) {
        let error: Error = new NotImplementedError();
        response.status(error.statusCode).json(error.payload);
    }

};

export default CategoryController;