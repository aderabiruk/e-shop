import transform_mongoose_error from 'mongoose-validation-error-handler';

import Payment, { IPayment } from '../models/Payment';

class PaymentDAL {
    
    /**
     * Create Payment
     * 
     * @param {string} order
     * @param {string} customer
     * @param {string} method
     * @param {string} status
     * @param {number} price
     * 
     * @returns {Promise<IPayment>}
     */
    static create(order: string, customer: string, method: string, status: string, price: number): Promise<IPayment> {
        return new Promise((resolve, reject) => {
            let payment = new Payment();
            payment.order = order;
            payment.customer = customer;
            payment.method = method;
            payment.status = status
            payment.price = price;
            payment.save((error, savedPayment) => {
                if (error) {
                    reject(transform_mongoose_error(error, { capitalize: true, humanize: true }))
                }
                else {
                    resolve(savedPayment);
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
     * @returns {Promise<IPayment[]>}
     */
    static findMany(query: any, page: number = 1, limit: number = 25): Promise<IPayment[]> {
        return new Promise((resolve, reject) => {
            Payment.find(query).limit(limit).skip((page - 1) * limit).exec((error, payments) => {
                if (error) {
                    reject(transform_mongoose_error(error, { capitalize: true, humanize: true }))
                }
                else {
                    resolve(payments);
                }
            });
        });
    }

    /**
     * Find One Payment
     * 
     * @param {any} query 
     * 
     * @returns {Promise<IPayment>}
     */
    static findOne(query: any): Promise<IPayment> {
        return new Promise((resolve, reject) => {
            Payment.findOne(query).exec((error, payment) => {
                if (error) {
                    reject(transform_mongoose_error(error, { capitalize: true, humanize: true }))
                }
                else {
                    resolve(payment);
                }
            });
        });
    }

    /**
     * Update Payment
     * 
     * @param {IPayment}    payment 
     * @param {any}         payload
     * 
     * @returns {Promise<IPayment>}
     */
    static update(payment: IPayment, payload: any): Promise<IPayment> {
        return new Promise((resolve, reject) => {
            if (payment) {
                payment.order = payload.order ? payload.order : payment.order;
                payment.customer = payload.customer ? payload.customer : payment.customer;
                payment.status = payload.status ? payload.status : payment.status;
                payment.method = payload.method ? payload.method : payment.method;
                payment.price = payload.price ? payload.price : payment.price;
                payment.updated_at = new Date();
                payment.save((error, updatedPayment) => {
                    if (error) {
                        reject(transform_mongoose_error(error, { capitalize: true, humanize: true }))
                    }
                    else {
                        resolve(updatedPayment);
                    }
                });
            }
            else {
                resolve(null)
            }
        });
    }

    /**
     * Delete Payment (Hard)
     * 
     * @param {any} query 
     * 
     * @returns {Promise<any>}
     */
    static deleteHard(query: any): Promise<any> {
        return new Promise((resolve, reject) => {
            Payment.deleteOne(query).exec((error, result) => {
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
     * Delete Payment (Soft)
     * 
     * @param {Category} category 
     * 
     * @returns {Promise<any>}
     */
    static deleteSoft(payment: IPayment): Promise<IPayment> {
        return new Promise((resolve, reject) => {
            if (payment) {
                payment.deleted_at = new Date();
                payment.save((error, deletedPayment) => {
                    if (error) {
                        reject(transform_mongoose_error(error, { capitalize: true, humanize: true }))
                    }
                    else {
                        resolve(deletedPayment);
                    }
                });
            } 
            else {
                resolve(null);
            } 
        });
    }
};

export default PaymentDAL;