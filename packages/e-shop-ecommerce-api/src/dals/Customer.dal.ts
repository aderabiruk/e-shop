import transform_mongoose_error from 'mongoose-validation-error-handler';

import Customer, { Customer as ICustomer } from '../models/Customer';

class CustomerDAL {

    /**
     * Create Customer
     * 
     * @param {string}  first_name
     * @param {string}  last_name
     * @param {string}  email
     * @param {string}  phone_number
     * @param {string}  gender
     * @param {string}  store_id
     * @param {Date}    birth_day
     * 
     * @returns {Promise<ICustomer>}
     */
    static create(first_name: string, last_name: string, email: string, phone_number: string, gender: string, store_id: string, birth_day: Date): Promise<ICustomer> {
        return new Promise((resolve, reject) => {
            let customer = new Customer();
            customer.first_name = first_name;
            customer.last_name = last_name;
            customer.email = email;
            customer.phone_number = phone_number;
            customer.gender = gender;
            customer.store_id = store_id;
            customer.birth_day = birth_day;
            customer.save((error, savedCustomer) => {
                if (error) {
                    reject(transform_mongoose_error(error, { capitalize: true, humanize: true }))
                }
                else {
                    resolve(savedCustomer);
                }
            });
        });
    }

    /**
     * Find Many Customers
     * 
     * @param {any}     query 
     * @param {number}  page 
     * @param {number}  limit 
     * 
     * @returns {Promise<ICustomer[]>}
     */
    static findMany(query: any, page: number = 1, limit: number = 25): Promise<ICustomer[]> {
        return new Promise((resolve, reject) => {
            Customer.find(query).limit(limit).skip((page - 1) * limit).exec((error, customers) => {
                if (error) {
                    reject(transform_mongoose_error(error, { capitalize: true, humanize: true }))
                }
                else {
                    resolve(customers);
                }
            });
        });
    }

    /**
     * Find One Customer
     * 
     * @param {any} query 
     * 
     * @returns {Promise<ICustomer>}
     */
    static findOne(query: any): Promise<ICustomer> {
        return new Promise((resolve, reject) => {
            Customer.findOne(query).exec((error, customer) => {
                if (error) {
                    reject(transform_mongoose_error(error, { capitalize: true, humanize: true }))
                }
                else {
                    resolve(customer);
                }
            });
        });
    }

    /**
     * Update Customer
     * 
     * @param {Customer}    customer 
     * @param {any}         payload
     * 
     * @returns {Promise<ICustomer>}
     */
    static update(customer: ICustomer, payload: any): Promise<ICustomer> {
        return new Promise((resolve, reject) => {
            if (customer) {
                customer.first_name = payload.first_name ? payload.first_name : customer.first_name;
                customer.last_name = payload.last_name ? payload.last_name : customer.last_name;
                customer.email = payload.email ? payload.email : customer.email;
                customer.phone_number = payload.phone_number ? payload.phone_number : customer.phone_number;
                customer.gender = payload.gender ? payload.gender : customer.gender;
                customer.birth_day = payload.birth_day ? payload.birth_day : customer.birth_day;
                customer.store_id = payload.store_id ? payload.store_id : customer.store_id;

                customer.updated_at = new Date();
                customer.save((error, updatedCustomer) => {
                    if (error) {
                        reject(transform_mongoose_error(error, { capitalize: true, humanize: true }))
                    }
                    else {
                        resolve(updatedCustomer);
                    }
                });
            }
            else {
                resolve(null)
            }
        });
    }

    /**
     * Delete Customer (Hard)
     * 
     * @param {any} query 
     * 
     * @returns {Promise<any>}
     */
    static deleteHard(query: any): Promise<any> {
        return new Promise((resolve, reject) => {
            Customer.deleteOne(query).exec((error, result) => {
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
     * Delete Customer (Soft)
     * 
     * @param {Customer} customer 
     * 
     * @returns {Promise<any>}
     */
    static deleteSoft(store: ICustomer): Promise<ICustomer> {
        return new Promise((resolve, reject) => {
            if (store) {
                store.deleted_at = new Date();
                store.save((error, deletedCustomer) => {
                    if (error) {
                        reject(transform_mongoose_error(error, { capitalize: true, humanize: true }))
                    }
                    else {
                        resolve(deletedCustomer);
                    }
                });
            } 
            else {
                resolve(null);
            } 
        });
    }

};

export default CustomerDAL;