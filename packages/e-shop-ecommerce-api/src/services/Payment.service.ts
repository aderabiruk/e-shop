import async from 'async';
import mongoose from 'mongoose';
import evalidate from 'evalidate';

import { IOrder } from '../models/Order';
import Messages from '../errors/Messages';
import OrderService from './Order.service';
import PaymentDAL from '../dals/Payment.dal';
import { ICustomer } from '../models/Customer';
import CustomerService from './Customer.service';
import Payment, { IPayment } from '../models/Payment';
import { IPaymentMethod } from '../models/PaymentMethod';
import PaymentMethodService from './PaymentMethod.service';
import { NotFoundError, BadRequestError, InternalServerError } from '../errors/Errors';
import { IPaginationResponse, PaginationAdapter } from '../utilities/adapters/Pagination';


class PaymentService {

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
            async.waterfall([
                (done: Function) => {
                    const Schema = new evalidate.schema({
                        order: evalidate.string().required(Messages.PAYMENT_ORDER_REQUIRED),
                        customer: evalidate.string().required(Messages.PAYMENT_CUSTOMER_REQUIRED),
                        method: evalidate.string().required(Messages.PAYMENT_METHOD_REQUIRED),
                        status: evalidate.string().required(Messages.PAYMENT_STATUS_REQUIRED),
                        price: evalidate.number().required(Messages.PAYMENT_PRICE_REQUIRED),
                    });
                    const result = Schema.validate({ order: order, customer: customer, method: method, status: status, price: price });
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
                    CustomerService.findByID(customer)
                        .then((customer: ICustomer) => {
                            if (!customer) {
                                done(new BadRequestError([ { field: "customer", message: Messages.CUSTOMER_NOT_FOUND } ]));
                            }
                            else {
                                done(null, order, customer);
                            }
                        })
                        .catch((error: any) => {
                            done(new InternalServerError(error));
                        });
                },
                (order: IOrder, customer: ICustomer, done: Function) => {
                    PaymentMethodService.findByID(method)
                        .then((paymentMethod: IPaymentMethod) => {
                            if (!paymentMethod) {
                                done(new BadRequestError([ { field: "method", message: Messages.PAYMENT_METHOD_NOT_FOUND } ]));
                            }
                            else {
                                done(null, order, customer, paymentMethod);
                            }
                        })
                        .catch((error: any) => {
                            done(new InternalServerError(error));
                        });
                },
                (order: IOrder, customer: ICustomer, method: IPaymentMethod, done: Function) => {
                    PaymentDAL.create(order._id, customer._id, method._id, status, price)
                        .then((payment: IPayment) => {
                            resolve(payment);
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
     * Find All Payments
     * 
     * @param {number} page
     * @param {number} limit
     * 
     * @returns {Promise<IPaginationResponse[]>}
     */
    static findAll(page: number = 1, limit: number = 25): Promise<IPaginationResponse> {
        return new Promise((resolve, reject) => {
            PaymentDAL.findMany({ deleted_at: null }, page, limit)
                .then((payments: IPayment[]) => {
                    resolve(PaginationAdapter(payments, page, limit));
                })
                .catch((error) => {
                    reject(new InternalServerError(error));
                });

        });
    }

    /**
     * Find Payment By ID
     * 
     * @param {number} page
     * @param {number} limit
     * 
     * @returns {Promise<IPayment[]>}
     */
    static findByID(id: string): Promise<IPayment> {
        return new Promise((resolve, reject) => {
            if (!mongoose.isValidObjectId(id)) {
                resolve(null);
            }
            else {
                PaymentDAL.findOne({ _id: id })
                    .then((payment: IPayment) => {
                        resolve(payment);
                    })
                    .catch((error) => {
                        reject(new InternalServerError(error));
                    });
            }
        });
    }

    /**
     * Update Payment By ID
     * 
     * @param {string}  id 
     * @param {any}     payload 
     * 
     * @returns {Promise<IPayment>}
     */
    static update(id: string, payload: any = {}): Promise<IPayment> {
        return new Promise((resolve, reject) => {
            async.waterfall([
                (done: Function) => {
                    PaymentService.findByID(id)
                        .then((payment: IPayment) => {
                            if (payment) {
                                done(null, payment);
                            }
                            else {
                                done(new NotFoundError(Messages.PAYMENT_NOT_FOUND));
                            }
                        })
                        .catch((error: any) => {
                            done(new InternalServerError(error));
                        });
                },
                (payment: IPayment, done: Function) => {
                    if (payload && payload.order) {
                        OrderService.findByID(payload.order)
                            .then((order: IOrder) => {
                                if (!order) {
                                    done(new BadRequestError([ { field: "order", message: Messages.ORDER_NOT_FOUND } ]));
                                }
                                else {
                                    done(null, payment, order);
                                }
                            })
                            .catch((error: any) => {
                                done(new InternalServerError(error));
                            });
                    }
                    else {
                        done(null, payment, null);
                    }
                },
                (payment: IPayment, order: IOrder, done: Function) => {
                    if (payload && payload.customer) {
                        CustomerService.findByID(payload.customer)
                            .then((customer: ICustomer) => {
                                if (!customer) {
                                    done(new BadRequestError([ { field: "customer", message: Messages.CUSTOMER_NOT_FOUND } ]));
                                }
                                else {
                                    done(null, payment, order, customer);
                                }
                            })
                            .catch((error: any) => {
                                done(new InternalServerError(error));
                            });
                    }
                    else {
                        done(null, payment, order, null);
                    }
                },
                (payment: IPayment, order: IOrder, customer: ICustomer, done: Function) => {
                    if (payload && payload.method) {
                        PaymentMethodService.findByID(payload.method)
                            .then((paymentMethod: IPaymentMethod) => {
                                if (!paymentMethod) {
                                    done(new BadRequestError([ { field: "method", message: Messages.PAYMENT_METHOD_NOT_FOUND } ]));
                                }
                                else {
                                    done(null, payment, order, customer, paymentMethod);
                                }
                            })
                            .catch((error: any) => {
                                done(new InternalServerError(error));
                            });
                    }
                    else {
                        done(null, payment, order, customer, null);
                    }
                },
                (payment: IPayment, order: IOrder, customer: ICustomer, method: IPaymentMethod, done: Function) => {
                    PaymentDAL.update(payment, payload)
                        .then((updatedPayment: IPayment) => {
                            resolve(updatedPayment);
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

export default PaymentService;