import async from 'async';
import mongoose from 'mongoose';
import evalidate from 'evalidate';

import { ICity } from '../models/City';
import CityDAL from '../dals/City.dal';
import Messages from '../errors/Messages';
import { ICountry } from '../models/Country';
import CountryService from './Country.service';
import { NotFoundError, BadRequestError, InternalServerError } from '../errors/Errors';
import { IPaginationResponse, PaginationAdapter } from '../utilities/adapters/Pagination';
import { error } from 'winston';

class CityService {

    /**
     * Filter Cities
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
                    CityDAL.count(query)
                        .then((count) => {
                            done(null, count);
                        })
                        .catch((error) => {
                            done(new InternalServerError(error));
                        });
                },
                (count: number, done: Function) => {
                    CityDAL.findMany(query, page, limit)
                        .then((cities: ICity[]) => {
                            resolve(PaginationAdapter(cities, page, limit, count));
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
     * Create City
     * 
     * @param {string} name
     * @param {string} code
     * @param {string} country
     * @param {number} latitude
     * @param {number} longitude
     * 
     * @returns {Promise<ICity>}
     */
    static create(name: string, code: string, country: string, latitude: number, longitude: number): Promise<ICity> {
        return new Promise((resolve, reject) => {
            async.waterfall([
                (done: Function) => {
                    const Schema = new evalidate.schema({
                        name: evalidate.string().required(Messages.CITY_NAME_REQUIRED),
                        code: evalidate.string().required(Messages.CITY_CODE_REQUIRED),
                        country: evalidate.string().required(Messages.CITY_COUNTRY_REQUIRED),
                        latitude: evalidate.number().required(Messages.CITY_LOCATION_REQUIRED),
                        longitude: evalidate.number().required(Messages.CITY_LOCATION_REQUIRED),
                    });

                    const result = Schema.validate({ name: name, code: code, country: country, latitude: latitude, longitude: longitude });
                    if (result.isValid) {
                        done(null);
                    }
                    else {
                        done(new BadRequestError(result.errors));
                    }
                },
                (done: Function) => {
                    CountryService.findByID(country)
                        .then((country: ICountry) => {
                            if (!country) {
                                done(new BadRequestError([ { field: "country", message: Messages.COUNTRY_NOT_FOUND } ]));
                            }
                            else {
                                done(null, country);
                            }
                        })
                        .catch((error: any) => {
                            done(new InternalServerError(error));
                        });
                },
                (country: ICountry, done: Function) => {
                    CityDAL.create(name, code, country._id, latitude, longitude)
                        .then((city: ICity) => {
                            resolve(city);
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
     * Find All Cities
     * 
     * @param {string} term
     * @param {number} page
     * @param {number} limit
     * 
     * @returns {Promise<IPaginationResponse[]>}
     */
    static findAll(term: string = "", page: number = 1, limit: number = 25): Promise<IPaginationResponse> {
        return new Promise((resolve, reject) => {
            let query: any;
            if (term) {
                query = { $or: [ { name: { $regex: new RegExp(term, "i") } }, { code: { $regex: new RegExp(term, "i") } } ], deleted_at: null }
            }
            else {
                query = { deleted_at: null }
            }

            CityService.filter(query, page, limit)
                .then((result: IPaginationResponse) => {
                    resolve(result);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    /**
     * Find Cities By Country
     * 
     * @param {string} country
     * @param {number} page
     * @param {number} limit
     * 
     * @returns {Promise<IPaginationResponse[]>}
     */
    static findByCountry(country: string, page: number = 1, limit: number = 25): Promise<IPaginationResponse> {
        return new Promise((resolve, reject) => {
            if (mongoose.isValidObjectId(country)) {
                let query: any = { country: country, deleted_at: null }
                CityService.filter(query, page, limit)
                    .then((result: IPaginationResponse) => {
                        resolve(result);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            }
            else {
                resolve(PaginationAdapter([], page, limit, 0));
            }
        });
    }

    /**
     * Find Cities By Location
     * 
     * @param {number} latitude
     * @param {number} longitude
     * @param {number} distance
     * @param {number} page
     * @param {number} limit
     * 
     * @returns {Promise<IPaginationResponse[]>}
     */
    static findByLocation(latitude: number, longitude: number, distance: number, page: number = 1, limit: number = 25): Promise<IPaginationResponse> {
        return new Promise((resolve, reject) => {
            let query: any = {
                location: { 
                    $near: { 
                        $maxDistance: distance, 
                        $geometry: { 
                            type: "Point", 
                            coordinates: [ longitude, latitude ] 
                        } 
                    } 
                },
                deleted_at: null 
            };
            CityService.filter(query, page, limit)
                .then((result: IPaginationResponse) => {
                    resolve(result);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    /**
     * Find City By ID
     * 
     * @param {string} id
     * 
     * @returns {Promise<ICity[]>}
     */
    static findByID(id: string): Promise<ICity> {
        return new Promise((resolve, reject) => {
            if (!mongoose.isValidObjectId(id)) {
                resolve(null);
            }
            else {
                CityDAL.findOne({ _id: id })
                    .then((city) => {
                        resolve(city);
                    })
                    .catch((error) => {
                        reject(new InternalServerError(error));
                    });
            }
        });
    }

    /**
     * Update City By ID
     * 
     * @param {string}  id 
     * @param {any}     payload 
     * 
     * @returns {Promise<ICity>}
     */
    static update(id: string, payload: any = {}): Promise<ICity> {
        return new Promise((resolve, reject) => {
            async.waterfall([
                (done: Function) => {
                    CityService.findByID(id)
                        .then((city: ICity) => {
                            if (city) {
                                done(null, city);
                            }
                            else {
                                done(new NotFoundError(Messages.CITY_NOT_FOUND));
                            }
                        })
                        .catch((error: any) => {
                            done(new InternalServerError(error));
                        });
                },
                (city: ICity, done: Function) => {
                    if (payload && payload.country) {
                        CountryService.findByID(payload.country)
                            .then((country: ICountry) => {
                                if (country) {
                                    done(null, city, country);
                                }
                                else {
                                    done(new BadRequestError([ { field: "country", message: Messages.COUNTRY_NOT_FOUND } ]));
                                }
                            })
                            .catch((error: any) => {
                                done(new InternalServerError(error));
                            });
                    }
                    else {
                        done(null, city, null);
                    }
                },
                (city: ICity, country: ICountry, done: Function) => {
                    CityDAL.update(city, payload)
                        .then((updatedCity: ICity) => {
                            resolve(updatedCity);
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
};

export default CityService;