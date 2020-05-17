import async from 'async';
import mongoose from 'mongoose';
import evalidate from 'evalidate';

import { IOrder } from '../models/Order';
import Messages from '../errors/Messages';
import OrderService from './Order.service';
import ShipmentDAL from '../dals/Shipment.dal';
import { ICustomer } from '../models/Customer';
import CustomerService from './Customer.service';
import Shipment, { IShipment } from '../models/Shipment';
import { IShipmentMethod } from '../models/ShipmentMethod';
import ShipmentMethodService from './ShipmentMethod.service';
import { NotFoundError, BadRequestError, InternalServerError } from '../errors/Errors';
import { IPaginationResponse, PaginationAdapter } from '../utilities/adapters/Pagination';


class ShipmentService {

    /**
     * Create Shipment
     * 
     * @param {string} order
     * @param {string} method
     * @param {string} status
     * @param {number} tracking_code
     * 
     * @returns {Promise<IShipment>}
     */
    static create(order: string, method: string, status: string, tracking_code: string): Promise<IShipment> {
        return new Promise((resolve, reject) => {
            async.waterfall([
                (done: Function) => {
                    const Schema = new evalidate.schema({
                        order: evalidate.string().required(Messages.SHIPMENT_ORDER_REQUIRED),
                        method: evalidate.string().required(Messages.SHIPMENT_METHOD_REQUIRED),
                        status: evalidate.string().required(Messages.SHIPMENT_STATUS_REQUIRED),
                        tracking_code: evalidate.string().required(Messages.SHIPMENT_TRACKING_CODE_REQUIRED),
                    });
                    const result = Schema.validate({ order: order, method: method, status: status, tracking_code: tracking_code });
                    if (result.isValid) {
                        done(null);
                    }
                    else {
                        done(new BadRequestError(result.errors));
                    }
                },
                (done: Function) => {
                    OrderService.findByID(order)
                        .then((order: IOrder) => {
                            if (!order) {
                                done(new BadRequestError([ { field: "order", message: Messages.ORDER_NOT_FOUND } ]));
                            }
                            else {
                                done(null, order);
                            }
                        })
                        .catch((error: any) => {
                            done(new InternalServerError(error));
                        });
                },
                (order: IOrder, done: Function) => {
                    ShipmentMethodService.findByID(method)
                        .then((shipmentMethod: IShipmentMethod) => {
                            if (!shipmentMethod) {
                                done(new BadRequestError([ { field: "method", message: Messages.SHIPMENT_METHOD_NOT_FOUND } ]));
                            }
                            else {
                                done(null, order, shipmentMethod);
                            }
                        })
                        .catch((error: any) => {
                            done(new InternalServerError(error));
                        });
                },
                (order: IOrder, shipmentMethod: IShipmentMethod, done: Function) => {
                    ShipmentDAL.create(order._id, shipmentMethod._id, status, tracking_code)
                        .then((shipment: IShipment) => {
                            resolve(shipment);
                        })
                        .catch((error: any) => {
                            done(new BadRequestError(error));
                        });
                },
            ], (error: any) => {
                if (error) {
                    reject(error);
                }
            })
        });
    }

    /**
     * Find All Shipments
     * 
     * @param {number} page
     * @param {number} limit
     * 
     * @returns {Promise<IPaginationResponse[]>}
     */
    static findAll(page: number = 1, limit: number = 25): Promise<IPaginationResponse> {
        return new Promise((resolve, reject) => {
            ShipmentDAL.findMany({ deleted_at: null }, page, limit)
                .then((shipments: IShipment[]) => {
                    resolve(PaginationAdapter(shipments, page, limit));
                })
                .catch((error) => {
                    reject(new InternalServerError(error));
                });

        });
    }

    /**
     * Find Shipment By ID
     * 
     * @param {number} page
     * @param {number} limit
     * 
     * @returns {Promise<IShipment[]>}
     */
    static findByID(id: string): Promise<IShipment> {
        return new Promise((resolve, reject) => {
            if (!mongoose.isValidObjectId(id)) {
                resolve(null);
            }
            else {
                ShipmentDAL.findOne({ _id: id })
                    .then((shipment: IShipment) => {
                        resolve(shipment);
                    })
                    .catch((error) => {
                        reject(new InternalServerError(error));
                    });
            }
        });
    }

    /**
     * Update Shipment By ID
     * 
     * @param {string}  id 
     * @param {any}     payload 
     * 
     * @returns {Promise<IShipment>}
     */
    static update(id: string, payload: any = {}): Promise<IShipment> {
        return new Promise((resolve, reject) => {
            async.waterfall([
                (done: Function) => {
                    ShipmentService.findByID(id)
                        .then((shipment: IShipment) => {
                            if (shipment) {
                                done(null, shipment);
                            }
                            else {
                                done(new NotFoundError(Messages.PAYMENT_NOT_FOUND));
                            }
                        })
                        .catch((error: any) => {
                            done(new InternalServerError(error));
                        });
                },
                (shipment: IShipment, done: Function) => {
                    if (payload && payload.order) {
                        OrderService.findByID(payload.order)
                            .then((order: IOrder) => {
                                if (!order) {
                                    done(new BadRequestError([ { field: "order", message: Messages.ORDER_NOT_FOUND } ]));
                                }
                                else {
                                    done(null, shipment, order);
                                }
                            })
                            .catch((error: any) => {
                                done(new InternalServerError(error));
                            });
                    }
                    else {
                        done(null, shipment, null);
                    }
                },
                (shipment: IShipment, order: IOrder, done: Function) => {
                    if (payload && payload.method) {
                        ShipmentMethodService.findByID(payload.method)
                            .then((shipmentMethod: IShipmentMethod) => {
                                if (!shipmentMethod) {
                                    done(new BadRequestError([ { field: "method", message: Messages.SHIPMENT_METHOD_NOT_FOUND } ]));
                                }
                                else {
                                    done(null, shipment, order, shipmentMethod);
                                }
                            })
                            .catch((error: any) => {
                                done(new InternalServerError(error));
                            });
                    }
                    else {
                        done(null, shipment, order, null);
                    }
                },
                (shipment: IShipment, order: IOrder, method: IShipmentMethod, done: Function) => {
                    ShipmentDAL.update(shipment, payload)
                        .then((updatedShipment: IShipment) => {
                            resolve(updatedShipment);
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
}

export default ShipmentService;