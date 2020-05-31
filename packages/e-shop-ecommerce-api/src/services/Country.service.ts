import async from "async";
import mongoose from 'mongoose';

import Messages from '../errors/Messages';
import CountryDAL from "../dals/Country.dal";
import Country, { ICountry } from "../models/Country";
import { NotFoundError, BadRequestError, InternalServerError } from '../errors/Errors';
import { IPaginationResponse, PaginationAdapter } from '../utilities/adapters/Pagination';

class CountryService {

    /**
     * Filter countries
     * 
     * @param {any}     query
     * @param {number}  page
     * @param {number}  limit
     * 
     * @returns {Promise<IPaginationResponse[]>}
     */
    private static filter(query: any, page: number = 1, limit: number = 25): Promise<IPaginationResponse> {
        return new Promise((resolve, reject) => {
            async.waterfall([
                (done: Function) => {
                    CountryDAL.count(query)
                        .then((count) => {
                            done(null, count);
                        })
                        .catch((error) => {
                            done(new InternalServerError(error));
                        });
                },
                (count: number, done: Function) => {
                    CountryDAL.findMany(query, page, limit)
                        .then((countries: ICountry[]) => {
                            resolve(PaginationAdapter(countries, page, limit, count));
                        })
                        .catch((error) => {
                            done(new InternalServerError(error));
                        });
                }
            ], (error: any) => {
                if (error) {
                    reject(error);
                }
            });
        });
    }

    /**
     * Create Country
     * 
     * @param {string} name
     * @param {string} code
     * @param {string} flag
     * @param {string} currency_name
     * @param {string} currency_code
     * 
     * @returns {Promise<ICountry>}
     */
    public static create(name: string, code: string, flag: string, currency_name: string, currency_code: string): Promise<ICountry> {
        return new Promise((resolve, reject) => {
            async.waterfall([
                (done: Function) => {
                    CountryDAL.create(name, code, flag, currency_name, currency_code)
                        .then((country: ICountry) => {
                            resolve(country);
                        })
                        .catch((error: any) => {
                            done(new BadRequestError(error));
                        });
                }
            ], (error: any) => {
                if (error) {
                    reject(error);
                }
            });
        });
    }

    /**
     * Find All Countries
     * 
     * @param {string} term
     * @param {number} page
     * @param {number} limit
     * 
     * @returns {Promise<IPaginationResponse[]>}
     */
    public static findAll(term: string = "", page: number = 1, limit: number = 25): Promise<IPaginationResponse> {
        return new Promise((resolve, reject) => {
            let query: any;
            if (term) {
                query = { $or: [ { name: { $regex: new RegExp(term, "i") } }, { code: { $regex: new RegExp(term, "i") } } ], deleted_at: null }
            }
            else {
                query = { deleted_at: null }
            }

            CountryService.filter(query, page, limit)
                .then((result: IPaginationResponse) => {
                    resolve(result);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    /**
     * Find Country By ID
     * 
     * @param {string} id
     * 
     * @returns {Promise<ICountry[]>}
     */
    public static findByID(id: string): Promise<ICountry> {
        return new Promise((resolve, reject) => {
            if (!mongoose.isValidObjectId(id)) {
                resolve(null);
            }
            else {
                CountryDAL.findOne({ _id: id })
                    .then((country: ICountry) => {
                        resolve(country);
                    })
                    .catch((error) => {
                        reject(new InternalServerError(error));
                    });
            }
        });
    }

    /**
     * Update Country
     * 
     * @param {string}  id 
     * @param {any}     payload 
     * 
     * @returns {Promise<ICountry>}
     */
    public static update(id: string, payload: any = {}): Promise<ICountry> {
        return new Promise((resolve, reject) => {
            async.waterfall([
                (done: Function) => {
                    CountryService.findByID(id)
                        .then((country: ICountry) => {
                            if (country) {
                                done(null, country);
                            }
                            else {
                                done(new NotFoundError(Messages.COUNTRY_NOT_FOUND));
                            }
                        })
                        .catch((error: any) => {
                            done(new InternalServerError(error));
                        });
                },
                (country: ICountry, done: Function) => {
                    CountryDAL.update(country, payload)
                        .then((updatedCountry: ICountry) => {
                            resolve(updatedCountry);
                        })
                        .catch((error: any) => {
                            done(new BadRequestError(error));
                        })
                }
            ], (error: any) => {
                if (error) {
                    reject(error);
                }
            });
        });
    }
}

export default CountryService;