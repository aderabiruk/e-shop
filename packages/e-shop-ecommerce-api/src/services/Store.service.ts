import async from 'async';
import mongoose from 'mongoose';
import evalidate from 'evalidate';

import { ICity } from '../models/City';
import { IStore } from '../models/Store';
import StoreDAL from '../dals/Store.dal';
import CityService from './City.service';
import Messages from '../errors/Messages';
import { NotFoundError, BadRequestError, InternalServerError } from '../errors/Errors';
import { IPaginationResponse, PaginationAdapter } from '../utilities/adapters/Pagination';


class StoreService {

    /**
     * Filter Stores
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
                    StoreDAL.count(query)
                        .then((count) => {
                            done(null, count);
                        })
                        .catch((error) => {
                            done(new InternalServerError(error));
                        });
                },
                (count: number, done: Function) => {
                    StoreDAL.findMany(query, page, limit)
                        .then((stores: IStore[]) => {
                            resolve(PaginationAdapter(stores, page, limit, count));
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
     * Create Store
     * 
     * @param {string} name
     * @param {string} email
     * @param {string} phone_number
     * @param {string} city
     * @param {string} address
     * @param {number} latitude
     * @param {number} longitude
     * 
     * @returns {Promise<IStore>}
     */
    static create(name: string, email: string, phone_number: string, city: string, address: string, latitude: number, longitude: number): Promise<IStore> {
        return new Promise((resolve, reject) => {
            async.waterfall([
                (done: Function) => {
                    const Schema = new evalidate.schema({
                        name: evalidate.string().required(Messages.STORE_NAME_REQUIRED),
                        email: evalidate.string().email().required(Messages.STORE_EMAIL_REQUIRED),
                        phone_number: evalidate.string().required(Messages.STORE_PHONE_NUMBER_REQUIRED),
                        city: evalidate.string().required(Messages.STORE_CITY_REQUIRED),
                        address: evalidate.string().required(Messages.STORE_ADDRESS_REQUIRED),
                        latitude: evalidate.number().required(Messages.STORE_LOCATION_REQUIRED),
                        longitude: evalidate.number().required(Messages.STORE_LOCATION_REQUIRED),
                    });

                    const result = Schema.validate({ name: name, email: email, phone_number: phone_number, city: city, address: address, latitude: latitude, longitude: longitude });
                    if (result.isValid) {
                        done(null);
                    }
                    else {
                        done(new BadRequestError(result.errors));
                    }
                },
                (done: Function) => {
                    CityService.findByID(city)
                        .then((city: ICity) => {
                            if (!city) {
                                done(new BadRequestError([ { field: "city", message: Messages.CITY_NOT_FOUND } ]));
                            }
                            else {
                                done(null, city);
                            }
                        })
                        .catch((error: any) => {
                            done(new InternalServerError(error));
                        });
                },
                (city: ICity, done: Function) => {
                    StoreDAL.create(name, email, phone_number, city._id, address, latitude, longitude)
                        .then((store: IStore) => {
                            resolve(store);
                        })
                        .catch((error: any) => {
                            done(new BadRequestError(error));
                        });
                }
            ], (error: any) => {
                if (error) {
                    reject(error);
                }
            })
        });
    }

    /**
     * Find All Stores
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
                query = { $or: [ { name: { $regex: new RegExp(term, "i") } }, { email: { $regex: new RegExp(term, "i") } }, { phone_number: { $regex: new RegExp(term, "i") } } ], deleted_at: null }
            }
            else {
                query = { deleted_at: null }
            }

            StoreService.filter(query, page, limit)
                .then((result: IPaginationResponse) => {
                    resolve(result);
                })
                .catch((error) => {
                    reject(error);
                });

        });
    }

    /**
     * Find Stores By City
     * 
     * @param {string} city
     * @param {number} page
     * @param {number} limit
     * 
     * @returns {Promise<IPaginationResponse[]>}
     */
    static findByCity(city: string, page: number = 1, limit: number = 25): Promise<IPaginationResponse> {
        return new Promise((resolve, reject) => {
            if (mongoose.isValidObjectId(city)) {
                let query: any = { city: city, deleted_at: null }
                StoreService.filter(query, page, limit)
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
     * Find Stores By Location
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
            StoreService.filter(query, page, limit)
                .then((result: IPaginationResponse) => {
                    resolve(result);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    /**
     * Find Store By ID
     * 
     * @param {string} id
     * 
     * @returns {Promise<IStore[]>}
     */
    static findByID(id: string): Promise<IStore> {
        return new Promise((resolve, reject) => {
            if (!mongoose.isValidObjectId(id)) {
                resolve(null);
            }
            else {
                StoreDAL.findOne({ _id: id })
                    .then((store) => {
                        resolve(store);
                    })
                    .catch((error) => {
                        reject(new InternalServerError(error));
                    });
            }
        });
    }

    /**
     * Update Store By ID
     * 
     * @param {string}  id 
     * @param {any}     payload 
     * 
     * @returns {Promise<IStore>}
     */
    static update(id: string, payload: any = {}): Promise<IStore> {
        return new Promise((resolve, reject) => {
            async.waterfall([
                (done: Function) => {
                    StoreService.findByID(id)
                        .then((store: IStore) => {
                            if (store) {
                                done(null, store);
                            }
                            else {
                                done(new NotFoundError(Messages.STORE_NOT_FOUND));
                            }
                        })
                        .catch((error: any) => {
                            done(new InternalServerError(error));
                        });
                },
                (store: IStore, done: Function) => {
                    if (payload && payload.city) {
                        CityService.findByID(payload.city)
                            .then((city: ICity) => {
                                if (city) {
                                    done(null, store, city);
                                }
                                else {
                                    done(new BadRequestError([ { field: "city", message: Messages.CITY_NOT_FOUND } ]));
                                }
                            })
                            .catch((error: any) => {
                                done(new InternalServerError(error));
                            });
                    }
                    else {
                        done(null, store, null);
                    }
                },
                (store: IStore, city: ICity, done: Function) => {
                    StoreDAL.update(store, payload)
                        .then((updatedStore: IStore) => {
                            resolve(updatedStore);
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
};

export default StoreService;