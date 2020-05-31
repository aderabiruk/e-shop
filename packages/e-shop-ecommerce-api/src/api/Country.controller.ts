import async from "async";
import evalidate from "evalidate";
import validator from 'validator';
import { Request, Response } from 'express';

import Messages from '../errors/Messages';
import { ICountry } from '../models/Country';
import CountryService from "../services/Country.service";
import { IPaginationResponse } from '../utilities/adapters/Pagination';
import { Error, NotFoundError, NotImplementedError, BadRequestError } from '../errors/Errors';

class CountryController {
    
    /**
     * Create Category
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static create(request: Request, response: Response) {
        const Schema = new evalidate.schema({
            name: evalidate.string().required(Messages.COUNTRY_NAME_REQUIRED),
            code: evalidate.string().required(Messages.COUNTRY_CODE_REQUIRED),
            flag: evalidate.string().required(Messages.COUNTRY_FLAG_REQUIRED),
            currency_name: evalidate.string().required(Messages.COUNTRY_CURRENCY_NAME_REQUIRED),
            currency_code: evalidate.string().required(Messages.COUNTRY_CURRENCY_CODE_REQUIRED)
        });
        const result = Schema.validate(request.body);
        if (result.isValid) {
            CountryService.create(request.body.name, request.body.code, request.body.flag, request.body.currency_name, request.body.currency_code)
                .then((country: ICountry) => {
                    response.json(country);
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
     * Find All Countries
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static findAll(request: Request, response: Response) {
        let query: string = request.query.q ? request.query.q.toString() : "";
        let page: number = request.query.page && validator.isInt(request.query.page.toString()) ? parseInt(request.query.page.toString()) : 1;
        let limit: number = request.query.limit && validator.isInt(request.query.limit.toString()) ? parseInt(request.query.limit.toString()) : 25;

        CountryService.findAll(query, page, limit)
            .then((result: IPaginationResponse) => {
                response.json(result);
            })
            .catch((error: Error) => {
                response.status(error.statusCode).json(error.payload);
            });
    }

    /**
     * Find Country By ID
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static findByID(request: Request, response: Response) {
        CountryService.findByID(request.params.id)
            .then((country: ICountry) => {
                if (country) {
                    response.json(country);
                }
                else {
                    let error: Error = new NotFoundError(Messages.COUNTRY_NOT_FOUND);
                    response.status(error.statusCode).json(error.payload);
                }
                
            })
            .catch((error: Error) => {
                response.status(error.statusCode).json(error.payload);
            });
    }

    /**
     * Update Countr
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static update(request: Request, response: Response) {
        CountryService.update(request.params.id, request.body)
            .then((country: ICountry) => {
                response.json(country);
            })
            .catch((error: Error) => {
                response.status(error.statusCode).json(error.payload);
            });
    }

    /**
     * Delete Country
     * 
     * @param {Request} request 
     * @param {Response} response 
     */
    static delete(request: Request, response: Response) {
        let error: Error = new NotImplementedError();
        response.status(error.statusCode).json(error.payload);
    }
}

export default CountryController;