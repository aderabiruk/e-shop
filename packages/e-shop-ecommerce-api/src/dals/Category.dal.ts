import transform_mongoose_error from 'mongoose-validation-error-handler';

import Category, { ICategory } from '../models/Category';

class CategoryDAL {
    
    /**
     * Create Category
     * 
     * @param {string} name
     * @param {string} slug
     * @param {string} parent
     * @param {string} image_url
     * @param {string} description
     * 
     * @returns {Promise<Category>}
     */
    static create(name: string, slug: string, parent: string, image_url: string, description: string): Promise<ICategory> {
        return new Promise((resolve, reject) => {
            let category = new Category();
            category.name = name;
            category.slug = slug;
            category.parent = parent;
            category.image_url = image_url
            category.description = description;
            category.save((error, savedCategory) => {
                if (error) {
                    reject(transform_mongoose_error(error, { capitalize: true, humanize: true }))
                }
                else {
                    resolve(savedCategory);
                }
            });
        });
    }

    /**
     * Count Categories
     * 
     * @param {any}     query 
     * 
     * @returns {Promise<number>}
     */
    static count(query: any): Promise<number> {
        return new Promise((resolve, reject) => {
            Category.count(query).exec((error, count) => {
                if (error) {
                    reject(transform_mongoose_error(error, { capitalize: true, humanize: true }))
                }
                else {
                    resolve(count);
                }
            });
        });
    }

    /**
     * Find Many Categories
     * 
     * @param {any}     query 
     * @param {number}  page 
     * @param {number}  limit 
     * 
     * @returns {Promise<Category[]>}
     */
    static findMany(query: any, page: number = 1, limit: number = 25): Promise<ICategory[]> {
        return new Promise((resolve, reject) => {
            Category.find(query).limit(limit).skip((page - 1) * limit).exec((error, categories) => {
                if (error) {
                    reject(transform_mongoose_error(error, { capitalize: true, humanize: true }))
                }
                else {
                    resolve(categories);
                }
            });
        });
    }

    /**
     * Find One Categories
     * 
     * @param {any} query 
     * 
     * @returns {Promise<Category>}
     */
    static findOne(query: any): Promise<ICategory> {
        return new Promise((resolve, reject) => {
            Category.findOne(query).exec((error, category) => {
                if (error) {
                    reject(transform_mongoose_error(error, { capitalize: true, humanize: true }))
                }
                else {
                    resolve(category);
                }
            });
        });
    }

    /**
     * Update Category
     * 
     * @param {Category}    category 
     * @param {any}         payload
     * 
     * @returns {Promise<Category>}
     */
    static update(category: ICategory, payload: any): Promise<ICategory> {
        return new Promise((resolve, reject) => {
            if (category) {
                category.name = payload.name != null ? payload.name : category.name;
                category.slug = payload.slug != null ? payload.slug : category.slug;
                category.parent = payload.parent != null ? payload.parent : category.parent;
                category.image_url = payload.image_url != null ? payload.image_url : category.image_url;
                category.description = payload.description != null  ? payload.description : category.description;
                category.updated_at = new Date();
                category.save((error, savedCategory) => {
                    if (error) {
                        reject(transform_mongoose_error(error, { capitalize: true, humanize: true }))
                    }
                    else {
                        resolve(savedCategory);
                    }
                });
            }
            else {
                resolve(null)
            }
        });
    }

    /**
     * Delete Category (Hard)
     * 
     * @param {any} query 
     * 
     * @returns {Promise<any>}
     */
    static deleteHard(query: any): Promise<any> {
        return new Promise((resolve, reject) => {
            Category.deleteOne(query).exec((error, result) => {
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
     * Delete Category (Soft)
     * 
     * @param {Category} category 
     * 
     * @returns {Promise<any>}
     */
    static deleteSoft(category: ICategory): Promise<ICategory> {
        return new Promise((resolve, reject) => {
            if (category) {
                category.deleted_at = new Date();
                category.save((error, deletedCategory) => {
                    if (error) {
                        reject(transform_mongoose_error(error, { capitalize: true, humanize: true }))
                    }
                    else {
                        resolve(deletedCategory);
                    }
                });
            } 
            else {
                resolve(null);
            } 
        });
    }
};

export default CategoryDAL;