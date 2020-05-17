import voca from 'voca';
import async from 'async';
import mongoose from 'mongoose';
import evalidate from 'evalidate';

import { IShipmentMethod } from '../models/ShipmentMethod';
import ShipmentMethodDAL from '../dals/ShipmentMethod.dal';
import Messages from '../errors/Messages';
import { NotFoundError, BadRequestError, InternalServerError } from '../errors/Errors';
import { IPaginationResponse, PaginationAdapter } from '../utilities/adapters/Pagination';


class ShipmentMethodService {
    
    /**
     * Create Shipment Method
     * 
     * @param {string} name
     * 
     * @returns {Promise<IShipmentMethod>}
     */
    static create(name: string): Promise<IShipmentMethod> {
        return new Promise((resolve, reject) => {
            async.waterfall([
                (done: Function) => {
                    const Schema = new evalidate.schema({
                        name: evalidate.string().required(Messages.SHIPMENT_METHOD_NAME_REQUIRED)
                    });
                    const result = Schema.validate({ name: name });
                    if (result.isValid) {
                        done(null);
                    }
                    else {
                        done(new BadRequestError(result.errors));
                    }
                },
                (done: Function) => {
                    ShipmentMethodDAL.create(name)
                        .then((shipmentMethod: IShipmentMethod) => {
                            resolve(shipmentMethod);
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
     * Find All Shipment Methods
     * 
     * @param {number} page
     * @param {number} limit
     * 
     * @returns {Promise<IPaginationResponse[]>}
     */
    static findAll(page: number = 1, limit: number = 25): Promise<IPaginationResponse> {
        return new Promise((resolve, reject) => {
            ShipmentMethodDAL.findMany({ deleted_at: null }, page, limit)
                .then((shipmentMethods: IShipmentMethod[]) => {
                    resolve(PaginationAdapter(shipmentMethods, page, limit));
                })
                .catch((error) => {
                    reject(new InternalServerError(error));
                });

        });
    }

    /**
     * Find Shipment Method By ID
     * 
     * @param {number} page
     * @param {number} limit
     * 
     * @returns {Promise<IShipmentMethod[]>}
     */
    static findByID(id: string): Promise<IShipmentMethod> {
        return new Promise((resolve, reject) => {
            if (!mongoose.isValidObjectId(id)) {
                resolve(null);
            }
            else {
                ShipmentMethodDAL.findOne({ _id: id })
                    .then((shipmentMethod) => {
                        resolve(shipmentMethod);
                    })
                    .catch((error) => {
                        reject(new InternalServerError(error));
                    });
            }
        });
    }

    /**
     * Update Shipment Method By ID
     * 
     * @param {string}  id 
     * @param {any}     payload 
     * 
     * @returns {Promise<IShipmentMethod>}
     */
    static update(id: string, payload: any = {}): Promise<IShipmentMethod> {
        return new Promise((resolve, reject) => {
            async.waterfall([
                (done: Function) => {
                    ShipmentMethodService.findByID(id)
                        .then((shipmentMethod: IShipmentMethod) => {
                            if (shipmentMethod) {
                                done(null, shipmentMethod);
                            }
                            else {
                                done(new NotFoundError(Messages.SHIPMENT_METHOD_NOT_FOUND));
                            }
                        })
                        .catch((error: any) => {
                            done(new InternalServerError(error));
                        });
                },
                (shipmentMethod: IShipmentMethod, done: Function) => {
                    ShipmentMethodDAL.update(shipmentMethod, payload)
                        .then((updatedShipmentMethod: IShipmentMethod) => {
                            resolve(updatedShipmentMethod);
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

export default ShipmentMethodService;