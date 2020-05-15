import transform_mongoose_error from 'mongoose-validation-error-handler';

import Country, { ICountry } from '../models/Country';

class CountryDAL {
    
    /**
     * Create Country
     * 
     * @param {string} name
     * @param {string} code
     * @param {string} flag
     * @param {string} currency_name
     * @param {string} currency_code
     * 
     * @returns {Promise<Country>}
     */
    static create(name: string, code: string, flag: string, currency_name: string, currency_code: string): Promise<ICountry> {
        return new Promise((resolve, reject) => {
            let country = new Country();
            country.name = name;
            country.code = code;
            country.flag = flag;
            country.currency_name = currency_name;
            country.currency_code = currency_code;
            country.save((error, savedCountry) => {
                if (error) {
                    reject(transform_mongoose_error(error, { capitalize: true, humanize: true }))
                }
                else {
                    resolve(savedCountry);
                }
            });
        });
    }

    /**
     * Find Many Countries
     * 
     * @param {any}     query 
     * @param {number}  page 
     * @param {number}  limit 
     * 
     * @returns {Promise<Country[]>}
     */
    static findMany(query: any, page: number = 1, limit: number = 25): Promise<ICountry[]> {
        return new Promise((resolve, reject) => {
            Country.find(query).limit(limit).skip((page - 1) * limit).exec((error, countries) => {
                if (error) {
                    reject(transform_mongoose_error(error, { capitalize: true, humanize: true }))
                }
                else {
                    resolve(countries);
                }
            });
        });
    }

    /**
     * Find One Country
     * 
     * @param {any} query 
     * 
     * @returns {Promise<ICountry>}
     */
    static findOne(query: any): Promise<ICountry> {
        return new Promise((resolve, reject) => {
            Country.findOne(query).exec((error, country) => {
                if (error) {
                    reject(transform_mongoose_error(error, { capitalize: true, humanize: true }))
                }
                else {
                    resolve(country);
                }
            });
        });
    }

    /**
     * Update Country
     * 
     * @param {Country} country 
     * @param {any} payload
     * 
     * @returns {Promise<Country>}
     */
    static update(country: ICountry, payload: any): Promise<ICountry> {
        return new Promise((resolve, reject) => {
            if (country) {
                country.name = payload.name ? payload.name : country.name;
                country.code = payload.code ? payload.code : country.code;
                country.flag = payload.flag ? payload.flag : country.flag;
                country.currency_name = payload.currency_name ? payload.currency_name : country.currency_name;
                country.currency_code = payload.currency_code ? payload.currency_code : country.currency_code;
                country.updated_at = new Date();
                country.save((error, updatedCountry) => {
                    if (error) {
                        reject(transform_mongoose_error(error, { capitalize: true, humanize: true }))
                    }
                    else {
                        resolve(updatedCountry);
                    }
                });
            }
            else {
                resolve(null)
            }
        });
    }

    /**
     * Delete Country (Hard)
     * 
     * @param {any} query 
     * 
     * @returns {Promise<any>}
     */
    static deleteHard(query: any): Promise<any> {
        return new Promise((resolve, reject) => {
            Country.deleteOne(query).exec((error, result) => {
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
     * Delete Country (Soft)
     * 
     * @param {Country} country 
     * 
     * @returns {Promise<Country>}
     */
    static deleteSoft(country: ICountry): Promise<ICountry> {
        return new Promise((resolve, reject) => {
            if (country) {
                country.deleted_at = new Date();
                country.save((error, updatedCountry) => {
                    if (error) {
                        reject(transform_mongoose_error(error, { capitalize: true, humanize: true }))
                    }
                    else {
                        resolve(updatedCountry);
                    }
                });
            }
            else {
                resolve(null)
            }
        });
    }
};

export default CountryDAL;