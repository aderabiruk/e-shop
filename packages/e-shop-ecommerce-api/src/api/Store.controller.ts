import evalidate from 'evalidate';
import validator from 'validator';
import { Request, Response } from 'express';

import Messages from '../errors/Messages';
import Store, { IStore } from '../models/Store';
import StoreService from '../services/Store.service';
import { IPaginationResponse } from '../utilities/adapters/Pagination';
import { Error, NotFoundError, NotImplementedError, BadRequestError } from '../errors/Errors';

class StoreController {
    
    /**
     * Create Store
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static create(request: Request, response: Response) {
        const Schema = new evalidate.schema({
            name: evalidate.string().required(Messages.STORE_NAME_REQUIRED),
            email: evalidate.string().email().required(Messages.STORE_EMAIL_REQUIRED),
            phone_number: evalidate.string().required(Messages.STORE_PHONE_NUMBER_REQUIRED),
            city: evalidate.string().required(Messages.STORE_CITY_REQUIRED),
            address: evalidate.string().required(Messages.STORE_ADDRESS_REQUIRED),
            latitude: evalidate.string().numeric().required(Messages.STORE_LOCATION_REQUIRED),
            longitude: evalidate.string().numeric().required(Messages.STORE_LOCATION_REQUIRED),
        });

        const result = Schema.validate(request.body);
        if (result.isValid) {
            StoreService.create(request.body.name, request.body.email, request.body.phone_number, request.body.city, request.body.address, request.body.latitude, request.body.longitude)
                .then((store: IStore) => {
                    response.json(store);
                })
                .catch((error: Error) => {
                    response.status(error.statusCode).json(error.payload);
                });
        }
        else {
            let error = new BadRequestError(result.errors);
            response.status(error.statusCode).json(error.payload);
        }        
    }

    /**
     * Find All Stores
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static findAll(request: Request, response: Response) {
        let query: string = request.query.q ? request.query.q.toString() : "";
        let page: number = request.query.page && validator.isInt(request.query.page.toString()) ? parseInt(request.query.page.toString()) : 1;
        let limit: number = request.query.limit && validator.isInt(request.query.limit.toString()) ? parseInt(request.query.limit.toString()) : 25;

        StoreService.findAll(query, page, limit)
            .then((result: IPaginationResponse) => {
                response.json(result);
            })
            .catch((error: Error) => {
                response.status(error.statusCode).json(error.payload);
            });
    }

    /**
     * Find Stores By City
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static findByCity(request: Request, response: Response) {
        let page: number = request.query.page && validator.isInt(request.query.page.toString()) ? parseInt(request.query.page.toString()) : 1;
        let limit: number = request.query.limit && validator.isInt(request.query.limit.toString()) ? parseInt(request.query.limit.toString()) : 25;

        StoreService.findByCity(request.params.id, page, limit)
            .then((result: IPaginationResponse) => {
                response.json(result);
            })
            .catch((error: Error) => {
                response.status(error.statusCode).json(error.payload);
            });
    }

    /**
     * Find Stores By Location
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static findByLocation(request: Request, response: Response) {
        const Schema = new evalidate.schema({
            latitude: evalidate.string().required(Messages.CITY_FILTER_LOCATION_REQUIRED),
            longitude: evalidate.string().required(Messages.CITY_FILTER_LOCATION_REQUIRED),
            distance: evalidate.string().required(Messages.CITY_FILTER_MAX_DISTANCE_REQUREID),
        });

        const result = Schema.validate(request.body);
        if (result.isValid) {
            let page: number = request.query.page && validator.isInt(request.query.page.toString()) ? parseInt(request.query.page.toString()) : 1;
            let limit: number = request.query.limit && validator.isInt(request.query.limit.toString()) ? parseInt(request.query.limit.toString()) : 25;

            StoreService.findByLocation(request.body.latitude, request.body.longitude, request.body.distance, page, limit)
                .then((result: IPaginationResponse) => {
                    response.json(result);
                })
                .catch((error: Error) => {
                    response.status(error.statusCode).json(error.payload);
                });
        }
        else {
            let error: Error = new BadRequestError(result.errors);
            response.status(error.statusCode).json(error.payload);
        }
    }

    /**
     * Find Store By ID
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static findByID(request: Request, response: Response) {
        StoreService.findByID(request.params.id)
            .then((store: IStore) => {
                if (store) {
                    response.json(store);
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
     * Update Store
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static update(request: Request, response: Response) {
        StoreService.update(request.params.id, request.body)
            .then((store: IStore) => {
                response.json(store);
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

export default StoreController;