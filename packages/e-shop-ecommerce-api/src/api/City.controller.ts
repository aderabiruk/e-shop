import evalidate from 'evalidate';
import validator from 'validator';
import { Request, Response } from 'express';

import Messages from '../errors/Messages';
import City, { ICity } from '../models/City';
import CityService from '../services/City.service';
import { IPaginationResponse } from '../utilities/adapters/Pagination';
import { Error, NotFoundError, NotImplementedError, BadRequestError } from '../errors/Errors';

class CityController {
    
    /**
     * Create City
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static create(request: Request, response: Response) {
        const Schema = new evalidate.schema({
            name: evalidate.string().required(Messages.CITY_NAME_REQUIRED),
            code: evalidate.string().required(Messages.CITY_CODE_REQUIRED),
            country: evalidate.string().required(Messages.CITY_COUNTRY_REQUIRED),
            latitude: evalidate.string().numeric().required(Messages.CITY_LOCATION_REQUIRED),
            longitude: evalidate.string().numeric().required(Messages.CITY_LOCATION_REQUIRED),
        });

        const result = Schema.validate(request.body);
        if (result.isValid) {
            CityService.create(request.body.name, request.body.code, request.body.country, request.body.latitude, request.body.longitude)
                .then((city: ICity) => {
                    response.json(city);
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
     * Find All Cities
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static findAll(request: Request, response: Response) {
        let query: string = request.query.q ? request.query.q.toString() : "";
        let page: number = request.query.page && validator.isInt(request.query.page.toString()) ? parseInt(request.query.page.toString()) : 1;
        let limit: number = request.query.limit && validator.isInt(request.query.limit.toString()) ? parseInt(request.query.limit.toString()) : 25;

        CityService.findAll(query, page, limit)
            .then((result: IPaginationResponse) => {
                response.json(result);
            })
            .catch((error: Error) => {
                response.status(error.statusCode).json(error.payload);
            });
    }

    /**
     * Find Cities By Country
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static findByCountry(request: Request, response: Response) {
        let page: number = request.query.page && validator.isInt(request.query.page.toString()) ? parseInt(request.query.page.toString()) : 1;
        let limit: number = request.query.limit && validator.isInt(request.query.limit.toString()) ? parseInt(request.query.limit.toString()) : 25;

        CityService.findByCountry(request.params.id, page, limit)
            .then((result: IPaginationResponse) => {
                response.json(result);
            })
            .catch((error: Error) => {
                response.status(error.statusCode).json(error.payload);
            });
    }

    /**
     * Find Cities By Location
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

            CityService.findByLocation(request.body.latitude, request.body.longitude, request.body.distance, page, limit)
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
     * Find City By ID
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static findByID(request: Request, response: Response) {
        CityService.findByID(request.params.id)
            .then((city: ICity) => {
                if (city) {
                    response.json(city);
                }
                else {
                    let error: Error = new NotFoundError(Messages.CITY_NOT_FOUND);
                    response.status(error.statusCode).json(error.payload);
                }
                
            })
            .catch((error: Error) => {
                response.status(error.statusCode).json(error.payload);
            });
    }

    /**
     * Update City
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static update(request: Request, response: Response) {
        CityService.update(request.params.id, request.body)
            .then((city: ICity) => {
                response.json(city);
            })
            .catch((error: Error) => {
                response.status(error.statusCode).json(error.payload);
            });
    }

    /**
     * Delete City
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static delete(request: Request, response: Response) {
        let error: Error = new NotImplementedError();
        response.status(error.statusCode).json(error.payload);
    }
}

export default CityController;