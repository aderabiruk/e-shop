import transform_mongoose_error from 'mongoose-validation-error-handler';

import { IOrderPrice } from '../models/Price';
import { IAddress } from '../models/Location';
import Order, { IOrder, IOrderItem } from '../models/Order';

class OrderDAL {
    /**
     * Create Order
     * 
     * @param {string}      number 
     * @param {string}      customer_id
     * @param {IAddress}    billing_address 
     * @param {IAddress}    shipping_address 
     * @param {string}      status 
     * @param {string}      payment_method_id
     * @param {string}      shipping_method_id
     * @param {Array}       items 
     * @param {IOrderPrice} price 
     * @param {string}      note 
     * 
     * @returns {Promise<IOrder>}
     */
    static create(number: string, customer_id: string, billing_address: IAddress, shipping_address: IAddress, status: string, payment_method_id: string, shipping_method_id: string, items: IOrderItem[], price: IOrderPrice, note: string): Promise<IOrder> {
        return new Promise((resolve, reject) => {
            let order = new Order();
            order.number = number;
            order.customer_id = customer_id;
            order.billing_address = billing_address;
            order.shipping_address = shipping_address;
            order.status = status;
            order.payment_method_id = payment_method_id;
            order.shipping_method_id = shipping_method_id;
            order.items = items;
            order.price = price;
            order.note = note;
            order.save((error, savedOrder) => {
                if (error) {
                    reject(transform_mongoose_error(error, { capitalize: true, humanize: true }))
                }
                else {
                    resolve(savedOrder);
                }
            });
        });
    }

    /**
     * Find Many Orders
     * 
     * @param {any}     query 
     * @param {number}  page 
     * @param {number}  limit 
     * 
     * @returns {Promise<IOrder[]>}
     */
    static findMany(query: any, page: number = 1, limit: number = 25): Promise<IOrder[]> {
        return new Promise((resolve, reject) => {
            Order.find(query).limit(limit).skip((page - 1) * limit).exec((error, orders) => {
                if (error) {
                    reject(transform_mongoose_error(error, { capitalize: true, humanize: true }))
                }
                else {
                    resolve(orders);
                }
            });
        });
    }

    /**
     * Find One Order
     * 
     * @param {any} query 
     * 
     * @returns {Promise<IOrder>}
     */
    static findOne(query: any): Promise<IOrder> {
        return new Promise((resolve, reject) => {
            Order.findOne(query).exec((error, order) => {
                if (error) {
                    reject(transform_mongoose_error(error, { capitalize: true, humanize: true }))
                }
                else {
                    resolve(order);
                }
            });
        });
    }

    /**
     * Update Order
     * 
     * @param {Store}   store 
     * @param {any}     payload
     * 
     * @returns {Promise<IOrder>}
     */
    static update(order: IOrder, payload: any): Promise<IOrder> {
        return new Promise((resolve, reject) => {
            if (order) {
                order.note = payload.note ? payload.note : order.note;
                order.items = payload.items ? payload.items : order.items;
                order.number = payload.number ? payload.number : order.number;
                order.status = payload.status ? payload.status : order.status;
                order.customer_id = payload.customer_id ? payload.customer_id : order.customer_id;
                order.payment_method_id = payload.payment_method_id ? payload.payment_method_id : order.payment_method_id;
                order.shipping_method_id = payload.shipping_method_id ? payload.shipping_method_id : order.shipping_method_id;

                if (payload.billing_address) {
                    order.billing_address.city = payload.billing_address.city ? payload.billing_address.city : order.billing_address.city;
                    order.billing_address.address = payload.billing_address.address ? payload.billing_address.address : order.billing_address.address;
                    order.billing_address.country = payload.billing_address.country ? payload.billing_address.country : order.billing_address.country;
                    order.billing_address.province = payload.billing_address.province ? payload.billing_address.province : order.billing_address.province;
                    order.billing_address.zip_code = payload.billing_address.zip_code ? payload.billing_address.zip_code : order.billing_address.zip_code;
                }

                if (payload.shipping_address) {
                    order.shipping_address.city = payload.shipping_address.city ? payload.shipping_address.city : order.shipping_address.city;
                    order.shipping_address.address = payload.shipping_address.address ? payload.shipping_address.address : order.shipping_address.address;
                    order.shipping_address.country = payload.shipping_address.country ? payload.shipping_address.country : order.shipping_address.country;
                    order.shipping_address.province = payload.shipping_address.province ? payload.shipping_address.province : order.shipping_address.province;
                    order.shipping_address.zip_code = payload.shipping_address.zip_code ? payload.shipping_address.zip_code : order.shipping_address.zip_code;
                }
                
                if (payload.price) {
                    order.price.subtotal = payload.price.subtotal ? payload.price.subtotal : order.price.subtotal;
                    order.price.shipping_price = payload.price.shipping_price ? payload.price.shipping_price : order.price.shipping_price;
                    order.price.tax = payload.price.tax ? payload.price.tax : order.price.tax;
                    order.price.total_price = payload.price.total_price ? payload.price.total_price : order.price.total_price;
                }

                order.completed_at = payload.completed_at ? payload.completed_at : order.completed_at;
                order.updated_at = new Date();
                order.save((error, updatedOrder) => {
                    if (error) {
                        reject(transform_mongoose_error(error, { capitalize: true, humanize: true }))
                    }
                    else {
                        resolve(updatedOrder);
                    }
                });
            }
            else {
                resolve(null)
            }
        });
    }

    /**
     * Delete Order (Hard)
     * 
     * @param {any} query 
     * 
     * @returns {Promise<any>}
     */
    static deleteHard(query: any): Promise<any> {
        return new Promise((resolve, reject) => {
            Order.deleteOne(query).exec((error, result) => {
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
     * Delete Order (Soft)
     * 
     * @param {Order} order 
     * 
     * @returns {Promise<any>}
     */
    static deleteSoft(order: IOrder): Promise<IOrder> {
        return new Promise((resolve, reject) => {
            if (order) {
                order.deleted_at = new Date();
                order.save((error, deletedOrder) => {
                    if (error) {
                        reject(transform_mongoose_error(error, { capitalize: true, humanize: true }))
                    }
                    else {
                        resolve(deletedOrder);
                    }
                });
            } 
            else {
                resolve(null);
            } 
        });
    }
};

export default OrderDAL;
