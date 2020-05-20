import transform_mongoose_error from 'mongoose-validation-error-handler';

import City, { ICity } from '../models/City';

class CityDAL {

    /**
     * Create City
     * 
     * @param {string} name
     * @param {string} code
     * @param {string} country
     * @param {number} latitude
     * @param {number} longitude
     * 
     * @returns {Promise<ICity>}
     */
    static create(name: string, code: string, country: string, latitude: number, longitude: number): Promise<ICity> {
        return new Promise((resolve, reject) => {
            let city = new City();
            city.name = name;
            city.code = code;
            city.country = country;
            city.location = {
                type: "Point",
                coordinates: [ longitude, latitude ]
            };
            city.save((error, savedCity) => {
                if (error) {
                    reject(transform_mongoose_error(error, { capitalize: true, humanize: true }))
                }
                else {
                    resolve(savedCity);
                }
            });
        });
    }

    /**
     * Count Cities
     * 
     * @param {any}     query 
     * @param {number}  page 
     * @param {number}  limit 
     * 
     * @returns {Promise<number>}
     */
    static count(query: any): Promise<number> {
        return new Promise((resolve, reject) => {
            City.count(query).exec((error, count) => {
                if (error) {
                    console.log(error)
                    reject(transform_mongoose_error(error, { capitalize: true, humanize: true }))
                }
                else {
                    resolve(count);
                }
            });
        });
    }

    /**
     * Find Many Cities
     * 
     * @param {any}     query 
     * @param {number}  page 
     * @param {number}  limit 
     * 
     * @returns {Promise<ICity[]>}
     */
    static findMany(query: any, page: number = 1, limit: number = 25): Promise<ICity[]> {
        return new Promise((resolve, reject) => {
            City.find(query).limit(limit).skip((page - 1) * limit).exec((error, cities) => {
                if (error) {
                    reject(transform_mongoose_error(error, { capitalize: true, humanize: true }))
                }
                else {
                    resolve(cities);
                }
            });
        });
    }

    /**
     * Find One Store
     * 
     * @param {any} query 
     * 
     * @returns {Promise<ICity>}
     */
    static findOne(query: any): Promise<ICity> {
        return new Promise((resolve, reject) => {
            City.findOne(query).exec((error, city) => {
                if (error) {
                    reject(transform_mongoose_error(error, { capitalize: true, humanize: true }))
                }
                else {
                    resolve(city);
                }
            });
        });
    }

    /**
     * Update City
     * 
     * @param {City}   city 
     * @param {any}     payload
     * 
     * @returns {Promise<ICity>}
     */
    static update(city: ICity, payload: any): Promise<ICity> {
        return new Promise((resolve, reject) => {
            if (city) {
                city.name = payload.name ? payload.name : city.name;
                city.code = payload.code ? payload.code : city.code;
                city.country = payload.country ? payload.country : city.country;

                if (payload.latitude && payload.longitude) {
                    city.location = {
                        type: "Point",
                        coordinates: [ payload.longitude, payload.latitude ]
                    };
                }
                
                city.updated_at = new Date();
                city.save((error, updatedCity) => {
                    if (error) {
                        reject(transform_mongoose_error(error, { capitalize: true, humanize: true }))
                    }
                    else {
                        resolve(updatedCity);
                    }
                });
            }
            else {
                resolve(null)
            }
        });
    }

    /**
     * Delete City (Hard)
     * 
     * @param {any} query 
     * 
     * @returns {Promise<any>}
     */
    static deleteHard(query: any): Promise<any> {
        return new Promise((resolve, reject) => {
            City.deleteOne(query).exec((error, result) => {
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
     * Delete City (Soft)
     * 
     * @param {City} city 
     * 
     * @returns {Promise<any>}
     */
    static deleteSoft(city: ICity): Promise<ICity> {
        return new Promise((resolve, reject) => {
            if (city) {
                city.deleted_at = new Date();
                city.save((error, deletedCity) => {
                    if (error) {
                        reject(transform_mongoose_error(error, { capitalize: true, humanize: true }))
                    }
                    else {
                        resolve(deletedCity);
                    }
                });
            } 
            else {
                resolve(null);
            } 
        });
    }

};

export default CityDAL;