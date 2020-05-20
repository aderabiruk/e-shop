import validator from 'validator';
import { Request, Response } from 'express';

import Messages from '../errors/Messages';
import Tag, { ITag } from '../models/Tag';
import TagService from '../services/Tag.service';
import { IPaginationResponse } from '../utilities/adapters/Pagination';
import { Error, NotFoundError, NotImplementedError, BadRequestError } from '../errors/Errors';

class TagController {
    
    /**
     * Create Tag
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static create(request: Request, response: Response) {
        TagService.create(request.body.name, request.body.description)
            .then((tag: ITag) => {
                response.json(tag);
            })
            .catch((error: Error) => {
                response.status(error.statusCode).json(error.payload);
            });
    }

    /**
     * Find All Tags
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static findAll(request: Request, response: Response) {
        let query: string = request.query.q ? request.query.q.toString() : "";
        let page: number = request.query.page && validator.isInt(request.query.page.toString()) ? parseInt(request.query.page.toString()) : 1;
        let limit: number = request.query.limit && validator.isInt(request.query.limit.toString()) ? parseInt(request.query.limit.toString()) : 25;

        TagService.findAll(query, page, limit)
            .then((result: IPaginationResponse) => {
                response.json(result);
            })
            .catch((error: Error) => {
                response.status(error.statusCode).json(error.payload);
            });
    }

    /**
     * Find Tag By ID
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static findByID(request: Request, response: Response) {
        TagService.findByID(request.params.id)
            .then((tag: ITag) => {
                if (tag) {
                    response.json(tag);
                }
                else {
                    let error: Error = new NotFoundError(Messages.TAG_NOT_FOUND);
                    response.status(error.statusCode).json(error.payload);
                }
                
            })
            .catch((error: Error) => {
                response.status(error.statusCode).json(error.payload);
            });
    }

    /**
     * Update Tag
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static update(request: Request, response: Response) {
        TagService.update(request.params.id, request.body)
            .then((tag: ITag) => {
                response.json(tag);
            })
            .catch((error: Error) => {
                response.status(error.statusCode).json(error.payload);
            });
    }

    /**
     * Delete Tag
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static delete(request: Request, response: Response) {
        let error: Error = new NotImplementedError();
        response.status(error.statusCode).json(error.payload);
    }
}

export default TagController;