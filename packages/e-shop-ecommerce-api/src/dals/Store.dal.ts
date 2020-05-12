import transform_mongoose_error from 'mongoose-validation-error-handler';

import Store, { Store as IStore } from '../models/Store';

class StoreDAL {

    /**
     * Create Store
     * 
     * @param {string} name
     * @param {string} email
     * @param {string} phone_number
     * @param {string} city_id
     * @param {string} address
     * @param {number} latitude
     * @param {number} longitude
     * 
     * @returns {Promise<Tag>}
     */
    static create(name: string, email: string, phone_number: string, city_id: string, address: string, latitude: number, longitude: number): Promise<IStore> {
        return new Promise((resolve, reject) => {
            let store = new Store();
            store.name = name;
            store.email = email;
            store.phone_number = phone_number;
            store.city_id = city_id;
            store.address = address;
            store.location = {
                type: "Point",
                coordinates: [ longitude, latitude ]
            };
            store.save((error, savedStore) => {
                if (error) {
                    reject(transform_mongoose_error(error, { capitalize: true, humanize: true }))
                }
                else {
                    resolve(savedStore);
                }
            });
        });
    }

    /**
     * Find Many Stores
     * 
     * @param {any}     query 
     * @param {number}  page 
     * @param {number}  limit 
     * 
     * @returns {Promise<IStore[]>}
     */
    static findMany(query: any, page: number = 1, limit: number = 25): Promise<IStore[]> {
        return new Promise((resolve, reject) => {
            Store.find(query).limit(limit).skip((page - 1) * limit).exec((error, stores) => {
                if (error) {
                    reject(transform_mongoose_error(error, { capitalize: true, humanize: true }))
                }
                else {
                    resolve(stores);
                }
            });
        });
    }

    /**
     * Find One Store
     * 
     * @param {any} query 
     * 
     * @returns {Promise<IStore>}
     */
    static findOne(query: any): Promise<IStore> {
        return new Promise((resolve, reject) => {
            Store.findOne(query).exec((error, stores) => {
                if (error) {
                    reject(transform_mongoose_error(error, { capitalize: true, humanize: true }))
                }
                else {
                    resolve(stores);
                }
            });
        });
    }

    /**
     * Update Store
     * 
     * @param {Store}   store 
     * @param {any}     payload
     * 
     * @returns {Promise<IStore>}
     */
    static update(store: IStore, payload: any): Promise<IStore> {
        return new Promise((resolve, reject) => {
            if (store) {
                store.name = payload.name ? payload.name : store.name;
                store.email = payload.email ? payload.email : store.email;
                store.phone_number = payload.phone_number ? payload.phone_number : store.phone_number;
                store.address = payload.address ? payload.address : store.address;
                store.city_id = payload.city_id ? payload.city_id : store.city_id;

                if (payload.latitude && payload.longitude) {
                    store.location = {
                        type: "Point",
                        coordinates: [ payload.longitude, payload.latitude ]
                    };
                }
                
                store.updated_at = new Date();
                store.save((error, updatedStore) => {
                    if (error) {
                        reject(transform_mongoose_error(error, { capitalize: true, humanize: true }))
                    }
                    else {
                        resolve(updatedStore);
                    }
                });
            }
            else {
                resolve(null)
            }
        });
    }

    /**
     * Delete Store (Hard)
     * 
     * @param {any} query 
     * 
     * @returns {Promise<any>}
     */
    static deleteHard(query: any): Promise<any> {
        return new Promise((resolve, reject) => {
            Store.deleteOne(query).exec((error, result) => {
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
     * Delete Store (Soft)
     * 
     * @param {Store} store 
     * 
     * @returns {Promise<any>}
     */
    static deleteSoft(store: IStore): Promise<IStore> {
        return new Promise((resolve, reject) => {
            if (store) {
                store.deleted_at = new Date();
                store.save((error, deletedStore) => {
                    if (error) {
                        reject(transform_mongoose_error(error, { capitalize: true, humanize: true }))
                    }
                    else {
                        resolve(deletedStore);
                    }
                });
            } 
            else {
                resolve(null);
            } 
        });
    }

};

export default StoreDAL;