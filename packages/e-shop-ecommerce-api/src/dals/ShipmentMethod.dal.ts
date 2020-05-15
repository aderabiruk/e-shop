import transform_mongoose_error from 'mongoose-validation-error-handler';

import ShipmentMethod, { IShipmentMethod } from '../models/ShipmentMethod';

class ShipmentMethodDAL {

    /**
     * Create Shipment Method
     * 
     * @param {string} name
     * 
     * @returns {Promise<IShipmentMethod>}
     */
    static create(name: string): Promise<IShipmentMethod> {
        return new Promise((resolve, reject) => {
            let shipmentMethod = new ShipmentMethod();
            shipmentMethod.name = name;
            shipmentMethod.save((error, savedShipmentMethod) => {
                if (error) {
                    reject(transform_mongoose_error(error, { capitalize: true, humanize: true }))
                }
                else {
                    resolve(savedShipmentMethod);
                }
            });
        });
    }

    /**
     * Find Many Shipment Methods
     * 
     * @param {any}     query 
     * @param {number}  page 
     * @param {number}  limit 
     * 
     * @returns {Promise<IShipmentMethod[]>}
     */
    static findMany(query: any, page: number = 1, limit: number = 25): Promise<IShipmentMethod[]> {
        return new Promise((resolve, reject) => {
            ShipmentMethod.find(query).limit(limit).skip((page - 1) * limit).exec((error, shipment_methods) => {
                if (error) {
                    reject(transform_mongoose_error(error, { capitalize: true, humanize: true }))
                }
                else {
                    resolve(shipment_methods);
                }
            });
        });
    }

    /**
     * Find One Shipment Method
     * 
     * @param {any} query 
     * 
     * @returns {Promise<IShipmentMethod>}
     */
    static findOne(query: any): Promise<IShipmentMethod> {
        return new Promise((resolve, reject) => {
            ShipmentMethod.findOne(query).exec((error, shipment_method) => {
                if (error) {
                    reject(transform_mongoose_error(error, { capitalize: true, humanize: true }))
                }
                else {
                    resolve(shipment_method);
                }
            });
        });
    }

    /**
     * Update Shipment Method
     * 
     * @param {ShipmentMethod}  shipment_method 
     * @param {any}             payload
     * 
     * @returns {Promise<IShipmentMethod>}
     */
    static update(shipment_method: IShipmentMethod, payload: any): Promise<IShipmentMethod> {
        return new Promise((resolve, reject) => {
            if (shipment_method) {
                shipment_method.name = payload.name ? payload.name : shipment_method.name;
                shipment_method.updated_at = new Date();
                shipment_method.save((error, updatedShipmentMethod) => {
                    if (error) {
                        reject(transform_mongoose_error(error, { capitalize: true, humanize: true }))
                    }
                    else {
                        resolve(updatedShipmentMethod);
                    }
                });
            }
            else {
                resolve(null)
            }
        });
    }

    /**
     * Delete Shipment Method (Hard)
     * 
     * @param {any} query 
     * 
     * @returns {Promise<any>}
     */
    static deleteHard(query: any): Promise<any> {
        return new Promise((resolve, reject) => {
            ShipmentMethod.deleteOne(query).exec((error, result) => {
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
     * Delete Shipment Method (Soft)
     * 
     * @param {PaymentMethod} shipment_method 
     * 
     * @returns {Promise<any>}
     */
    static deleteSoft(shipment_method: IShipmentMethod): Promise<IShipmentMethod> {
        return new Promise((resolve, reject) => {
            if (shipment_method) {
                shipment_method.deleted_at = new Date();
                shipment_method.save((error, deletedShipmentMethod) => {
                    if (error) {
                        reject(transform_mongoose_error(error, { capitalize: true, humanize: true }))
                    }
                    else {
                        resolve(deletedShipmentMethod);
                    }
                });
            } 
            else {
                resolve(null);
            } 
        });
    }

};

export default ShipmentMethodDAL;