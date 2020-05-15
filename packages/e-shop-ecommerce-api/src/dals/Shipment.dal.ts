import transform_mongoose_error from 'mongoose-validation-error-handler';

import Shipment, { IShipment } from "../models/Shipment";

class ShipmentDAL {
    
    /**
     * Create Shipment
     * 
     * @param {string} order
     * @param {string} method
     * @param {string} status
     * @param {string} tracking_code
     * 
     * @returns {Promise<IShipment>}
     */
    static create(order: string, method: string, status: string, tracking_code: string): Promise<IShipment> {
        return new Promise((resolve, reject) => {
            let shipment = new Shipment();
            shipment.order = order;
            shipment.method = method;
            shipment.status = status
            shipment.tracking_code = tracking_code;
            shipment.save((error, savedShipment) => {
                if (error) {
                    reject(transform_mongoose_error(error, { capitalize: true, humanize: true }))
                }
                else {
                    resolve(savedShipment);
                }
            });
        });
    }

    /**
     * Find Many Payments
     * 
     * @param {any}     query 
     * @param {number}  page 
     * @param {number}  limit 
     * 
     * @returns {Promise<IShipment[]>}
     */
    static findMany(query: any, page: number = 1, limit: number = 25): Promise<IShipment[]> {
        return new Promise((resolve, reject) => {
            Shipment.find(query).limit(limit).skip((page - 1) * limit).exec((error, shipments) => {
                if (error) {
                    reject(transform_mongoose_error(error, { capitalize: true, humanize: true }))
                }
                else {
                    resolve(shipments);
                }
            });
        });
    }

    /**
     * Find One Payment
     * 
     * @param {any} query 
     * 
     * @returns {Promise<IShipment>}
     */
    static findOne(query: any): Promise<IShipment> {
        return new Promise((resolve, reject) => {
            Shipment.findOne(query).exec((error, shipment) => {
                if (error) {
                    reject(transform_mongoose_error(error, { capitalize: true, humanize: true }))
                }
                else {
                    resolve(shipment);
                }
            });
        });
    }

    /**
     * Update Payment
     * 
     * @param {IShipment}   shipment 
     * @param {any}         payload
     * 
     * @returns {Promise<IShipment>}
     */
    static update(shipment: IShipment, payload: any): Promise<IShipment> {
        return new Promise((resolve, reject) => {
            if (shipment) {
                shipment.order = payload.order ? payload.order : shipment.order;
                shipment.status = payload.status ? payload.status : shipment.status;
                shipment.method = payload.method ? payload.method : shipment.method;
                shipment.tracking_code = payload.tracking_code ? payload.tracking_code : shipment.tracking_code;
                shipment.updated_at = new Date();
                shipment.save((error, savedShipment) => {
                    if (error) {
                        reject(transform_mongoose_error(error, { capitalize: true, humanize: true }))
                    }
                    else {
                        resolve(savedShipment);
                    }
                });
            }
            else {
                resolve(null)
            }
        });
    }

    /**
     * Delete Shipment (Hard)
     * 
     * @param {any} query 
     * 
     * @returns {Promise<any>}
     */
    static deleteHard(query: any): Promise<any> {
        return new Promise((resolve, reject) => {
            Shipment.deleteOne(query).exec((error, result) => {
                if (error) {
                    reject(transform_mongoose_error(error, { capitalize: true, humanize: true }))
                }
                else {
                    resolve(result);
                }
            });
        });
    }

    /**
     * Delete Shipment (Soft)
     * 
     * @param {IShipment} shipment 
     * 
     * @returns {Promise<any>}
     */
    static deleteSoft(shipment: IShipment): Promise<IShipment> {
        return new Promise((resolve, reject) => {
            if (shipment) {
                shipment.deleted_at = new Date();
                shipment.save((error, deletedShipment) => {
                    if (error) {
                        reject(transform_mongoose_error(error, { capitalize: true, humanize: true }))
                    }
                    else {
                        resolve(deletedShipment);
                    }
                });
            } 
            else {
                resolve(null);
            } 
        });
    }
}

export default ShipmentDAL;