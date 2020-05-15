import transform_mongoose_error from 'mongoose-validation-error-handler';

import PaymentMethod, { IPaymentMethod } from '../models/PaymentMethod';

class PaymentMethodDAL {

    /**
     * Create Payment Method
     * 
     * @param {string} name
     * 
     * @returns {Promise<IPaymentMethod>}
     */
    static create(name: string): Promise<IPaymentMethod> {
        return new Promise((resolve, reject) => {
            let paymentMethod = new PaymentMethod();
            paymentMethod.name = name;
            paymentMethod.save((error, savedPaymentMethod) => {
                if (error) {
                    reject(transform_mongoose_error(error, { capitalize: true, humanize: true }))
                }
                else {
                    resolve(savedPaymentMethod);
                }
            });
        });
    }

    /**
     * Find Many Payment Methods
     * 
     * @param {any}     query 
     * @param {number}  page 
     * @param {number}  limit 
     * 
     * @returns {Promise<IPaymentMethod[]>}
     */
    static findMany(query: any, page: number = 1, limit: number = 25): Promise<IPaymentMethod[]> {
        return new Promise((resolve, reject) => {
            PaymentMethod.find(query).limit(limit).skip((page - 1) * limit).exec((error, paymnet_methods) => {
                if (error) {
                    reject(transform_mongoose_error(error, { capitalize: true, humanize: true }))
                }
                else {
                    resolve(paymnet_methods);
                }
            });
        });
    }

    /**
     * Find One Payment Method
     * 
     * @param {any} query 
     * 
     * @returns {Promise<IPaymentMethod>}
     */
    static findOne(query: any): Promise<IPaymentMethod> {
        return new Promise((resolve, reject) => {
            PaymentMethod.findOne(query).exec((error, paymnet_method) => {
                if (error) {
                    reject(transform_mongoose_error(error, { capitalize: true, humanize: true }))
                }
                else {
                    resolve(paymnet_method);
                }
            });
        });
    }

    /**
     * Update Payment Method
     * 
     * @param {PaymentMethod}   paymnet_method 
     * @param {any}             payload
     * 
     * @returns {Promise<IPaymentMethod>}
     */
    static update(paymnet_method: IPaymentMethod, payload: any): Promise<IPaymentMethod> {
        return new Promise((resolve, reject) => {
            if (paymnet_method) {
                paymnet_method.name = payload.name ? payload.name : paymnet_method.name;
                paymnet_method.updated_at = new Date();
                paymnet_method.save((error, updatedPaymentMethod) => {
                    if (error) {
                        reject(transform_mongoose_error(error, { capitalize: true, humanize: true }))
                    }
                    else {
                        resolve(updatedPaymentMethod);
                    }
                });
            }
            else {
                resolve(null)
            }
        });
    }

    /**
     * Delete Payment Method (Hard)
     * 
     * @param {any} query 
     * 
     * @returns {Promise<any>}
     */
    static deleteHard(query: any): Promise<any> {
        return new Promise((resolve, reject) => {
            PaymentMethod.deleteOne(query).exec((error, result) => {
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
     * Delete Payment Method (Soft)
     * 
     * @param {PaymentMethod} payment_method 
     * 
     * @returns {Promise<any>}
     */
    static deleteSoft(payment_method: IPaymentMethod): Promise<IPaymentMethod> {
        return new Promise((resolve, reject) => {
            if (payment_method) {
                payment_method.deleted_at = new Date();
                payment_method.save((error, deletedPaymentMethod) => {
                    if (error) {
                        reject(transform_mongoose_error(error, { capitalize: true, humanize: true }))
                    }
                    else {
                        resolve(deletedPaymentMethod);
                    }
                });
            } 
            else {
                resolve(null);
            } 
        });
    }

};

export default PaymentMethodDAL;