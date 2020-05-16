import voca from 'voca';
import async from 'async';
import mongoose from 'mongoose';
import evalidate from 'evalidate';

import { IPaymentMethod } from '../models/PaymentMethod';
import PaymentMethodDAL from '../dals/PaymentMethod.dal';
import Messages from '../errors/Messages';
import { NotFoundError, BadRequestError, InternalServerError } from '../errors/Errors';
import { IPaginationResponse, PaginationAdapter } from '../utilities/adapters/Pagination';


class PaymentMethodService {
    
    /**
     * Create Payment Method
     * 
     * @param {string} name
     * 
     * @returns {Promise<IPaymentMethod>}
     */
    static create(name: string, description: string): Promise<IPaymentMethod> {
        return new Promise((resolve, reject) => {
            async.waterfall([
                (done: Function) => {
                    const Schema = new evalidate.schema({
                        name: evalidate.string().required(Messages.PAYMENT_METHOD_NAME_REQUIRED)
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
                    PaymentMethodDAL.create(name)
                        .then((paymentMethod: IPaymentMethod) => {
                            resolve(paymentMethod);
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
     * Find All Payment Methods
     * 
     * @param {number} page
     * @param {number} limit
     * 
     * @returns {Promise<IPaginationResponse[]>}
     */
    static findAll(page: number = 1, limit: number = 25): Promise<IPaginationResponse> {
        return new Promise((resolve, reject) => {
            PaymentMethodDAL.findMany({ deleted_at: null }, page, limit)
                .then((paymentMethods: IPaymentMethod[]) => {
                    resolve(PaginationAdapter(paymentMethods, page, limit));
                })
                .catch((error) => {
                    reject(new InternalServerError(error));
                });

        });
    }

    /**
     * Find Payment Method By ID
     * 
     * @param {number} page
     * @param {number} limit
     * 
     * @returns {Promise<IPaymentMethod[]>}
     */
    static findByID(id: string): Promise<IPaymentMethod> {
        return new Promise((resolve, reject) => {
            if (!mongoose.isValidObjectId(id)) {
                resolve(null);
            }
            else {
                PaymentMethodDAL.findOne({ _id: id })
                    .then((paymentMethod) => {
                        resolve(paymentMethod);
                    })
                    .catch((error) => {
                        reject(new InternalServerError(error));
                    });
            }
        });
    }

    /**
     * Update Payment Method By ID
     * 
     * @param {string}  id 
     * @param {any}     payload 
     * 
     * @returns {Promise<IPaymentMethod>}
     */
    static update(id: string, payload: any = {}): Promise<IPaymentMethod> {
        return new Promise((resolve, reject) => {
            async.waterfall([
                (done: Function) => {
                    PaymentMethodService.findByID(id)
                        .then((paymentMethod: IPaymentMethod) => {
                            if (paymentMethod) {
                                done(null, paymentMethod);
                            }
                            else {
                                done(new NotFoundError(Messages.PAYMENT_METHOD_NOT_FOUND));
                            }
                        })
                        .catch((error: any) => {
                            done(error);
                        });
                },
                (paymentMethod: IPaymentMethod, done: Function) => {
                    PaymentMethodDAL.update(paymentMethod, payload)
                        .then((updatedPaymentMethod: IPaymentMethod) => {
                            resolve(updatedPaymentMethod);
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
};

export default PaymentMethodService;