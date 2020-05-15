import transform_mongoose_error from 'mongoose-validation-error-handler';

import Discount, { IDiscount } from '../models/Discount';

class DiscountDAL {

    /**
     * Create Discount
     * 
     * @param {string}  name
     * @param {string}  code
     * @param {number}  percentage
     * @param {Date}    start_date
     * @param {Date}    end_date
     * 
     * @returns {Promise<IDiscount>}
     */
    static create(name: string, code: string, percentage: number, start_date: Date, end_date: Date): Promise<IDiscount> {
        return new Promise((resolve, reject) => {
            let discount = new Discount();
            discount.name = name;
            discount.code = code;
            discount.percentage = percentage;
            discount.start_date = start_date;
            discount.end_date = end_date;
            discount.save((error, savedDiscount) => {
                if (error) {
                    reject(transform_mongoose_error(error, { capitalize: true, humanize: true }))
                }
                else {
                    resolve(savedDiscount);
                }
            });
        });
    }

    /**
     * Find Many Discounts
     * 
     * @param {any}     query 
     * @param {number}  page 
     * @param {number}  limit 
     * 
     * @returns {Promise<IDiscount[]>}
     */
    static findMany(query: any, page: number = 1, limit: number = 25): Promise<IDiscount[]> {
        return new Promise((resolve, reject) => {
            Discount.find(query).limit(limit).skip((page - 1) * limit).exec((error, discounts) => {
                if (error) {
                    reject(transform_mongoose_error(error, { capitalize: true, humanize: true }))
                }
                else {
                    resolve(discounts);
                }
            });
        });
    }

    /**
     * Find One Discount
     * 
     * @param {any} query 
     * 
     * @returns {Promise<IDiscount>}
     */
    static findOne(query: any): Promise<IDiscount> {
        return new Promise((resolve, reject) => {
            Discount.findOne(query).exec((error, discount) => {
                if (error) {
                    reject(transform_mongoose_error(error, { capitalize: true, humanize: true }))
                }
                else {
                    resolve(discount);
                }
            });
        });
    }

    /**
     * Update Discount
     * 
     * @param {Discount}    discount 
     * @param {any}         payload
     * 
     * @returns {Promise<IDiscount>}
     */
    static update(discount: IDiscount, payload: any): Promise<IDiscount> {
        return new Promise((resolve, reject) => {
            if (discount) {
                discount.name = payload.name ? payload.name : discount.name;
                discount.code = payload.code ? payload.code : discount.code;
                discount.percentage = payload.percentage ? payload.percentage : discount.percentage;
                discount.start_date = payload.start_date ? payload.start_date : discount.start_date;
                discount.end_date = payload.end_date ? payload.end_date : discount.end_date;
                discount.updated_at = new Date();
                discount.save((error, updatedDiscount) => {
                    if (error) {
                        reject(transform_mongoose_error(error, { capitalize: true, humanize: true }))
                    }
                    else {
                        resolve(updatedDiscount);
                    }
                });
            }
            else {
                resolve(null)
            }
        });
    }

    /**
     * Delete Discount (Hard)
     * 
     * @param {any} query 
     * 
     * @returns {Promise<any>}
     */
    static deleteHard(query: any): Promise<any> {
        return new Promise((resolve, reject) => {
            Discount.deleteOne(query).exec((error, result) => {
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
     * Delete Discount (Soft)
     * 
     * @param {Discount} discount 
     * 
     * @returns {Promise<any>}
     */
    static deleteSoft(discount: IDiscount): Promise<IDiscount> {
        return new Promise((resolve, reject) => {
            if (discount) {
                discount.deleted_at = new Date();
                discount.save((error, deleteDiscount) => {
                    if (error) {
                        reject(transform_mongoose_error(error, { capitalize: true, humanize: true }))
                    }
                    else {
                        resolve(deleteDiscount);
                    }
                });
            } 
            else {
                resolve(null);
            } 
        });
    }

};

export default DiscountDAL;