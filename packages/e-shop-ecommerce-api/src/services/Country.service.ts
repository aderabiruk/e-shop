import async from "async";
import mongoose from 'mongoose';
import evalidate from "evalidate";

import Messages from '../errors/Messages';
import CountryDAL from "../dals/Country.dal";
import Country, { ICountry } from "../models/Country";
import { NotFoundError, BadRequestError, InternalServerError } from '../errors/Errors';
import { IPaginationResponse, PaginationAdapter } from '../utilities/adapters/Pagination';

class CountryService {

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
    static create(name: string, code: string, flag: string, currency_name: string, currency_code: string): Promise<ICountry> {
        return new Promise((resolve, reject) => {
            async.waterfall([
                (done: Function) => {
                    const Schema = new evalidate.schema({
                        name: evalidate.string().required(Messages.COUNTRY_NAME_REQUIRED),
                        code: evalidate.string().required(Messages.COUNTRY_CODE_REQUIRED),
                        flag: evalidate.string().required(Messages.COUNTRY_FLAG_REQUIRED),
                        currency_name: evalidate.string().required(Messages.COUNTRY_CURRENCY_NAME_REQUIRED),
                        currency_code: evalidate.string().required(Messages.COUNTRY_CURRENCY_CODE_REQUIRED)
                    });
                    const result = Schema.validate({ name: name, code: code, flag: flag, currency_name: currency_name, currency_code: currency_code });
                    if (result.isValid) {
                        done(null);
                    }
                    else {
                        done(new BadRequestError(result.errors));
                    }
                },
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
     * @param {number} page
     * @param {number} limit
     * 
     * @returns {Promise<IPaginationResponse[]>}
     */
    static findAll(page: number = 1, limit: number = 25): Promise<IPaginationResponse> {
        return new Promise((resolve, reject) => {
            CountryDAL.findMany({ deleted_at: null }, page, limit)
                .then((countries: ICountry[]) => {
                    resolve(PaginationAdapter(countries, page, limit));
                })
                .catch((error) => {
                    reject(new InternalServerError(error));
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
    static findByID(id: string): Promise<ICountry> {
        return new Promise((resolve, reject) => {
            if (!mongoose.isValidObjectId(id)) {
                resolve(null);
            }
            else {
                CountryDAL.findOne({ _id: id })
                    .then((country) => {
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
    static update(id: string, payload: any = {}): Promise<ICountry> {
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
                            done(error);
                        });
                },
                (country: ICountry, done: Function) => {
                    CountryDAL.update(country, payload)
                        .then((country: ICountry) => {
                            resolve(country);
                        })
                        .catch((error: any) => {
                            done(error);
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