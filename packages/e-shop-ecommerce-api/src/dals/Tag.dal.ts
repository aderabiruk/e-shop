import transform_mongoose_error from 'mongoose-validation-error-handler';

import Tag, { ITag } from '../models/Tag';

class TagDAL {
    
    /**
     * Create Tag
     * 
     * @param {string} name
     * @param {string} slug
     * @param {string} description
     * 
     * @returns {Promise<ITag>}
     */
    static create(name: string, slug: string, description: string): Promise<ITag> {
        return new Promise((resolve, reject) => {
            let tag = new Tag();
            tag.name = name;
            tag.slug = slug;
            tag.description = description;
            tag.save((error, savedTag) => {
                if (error) {
                    reject(transform_mongoose_error(error, { capitalize: true, humanize: true }))
                }
                else {
                    resolve(savedTag);
                }
            });
        });
    }

    /**
     * Find Many Tags
     * 
     * @param {any}     query 
     * @param {number}  page 
     * @param {number}  limit 
     * 
     * @returns {Promise<ITag[]>}
     */
    static findMany(query: any, page: number = 1, limit: number = 25): Promise<ITag[]> {
        return new Promise((resolve, reject) => {
            Tag.find(query).limit(limit).skip((page - 1) * limit).exec((error, tags) => {
                if (error) {
                    reject(transform_mongoose_error(error, { capitalize: true, humanize: true }))
                }
                else {
                    resolve(tags);
                }
            });
        });
    }

    /**
     * Find One Tag
     * 
     * @param {any} query 
     * 
     * @returns {Promise<ITag>}
     */
    static findOne(query: any): Promise<ITag> {
        return new Promise((resolve, reject) => {
            Tag.findOne(query).exec((error, tag) => {
                if (error) {
                    reject(transform_mongoose_error(error, { capitalize: true, humanize: true }))
                }
                else {
                    resolve(tag);
                }
            });
        });
    }

    /**
     * Update Tag
     * 
     * @param {Tag} category 
     * @param {any} payload
     * 
     * @returns {Promise<ITag>}
     */
    static update(tag: ITag, payload: any): Promise<ITag> {
        return new Promise((resolve, reject) => {
            if (tag) {
                tag.name = payload.name ? payload.name : tag.name;
                tag.slug = payload.slug ? payload.slug : tag.slug;
                tag.description = payload.description ? payload.description : tag.description;
                tag.updated_at = new Date();
                tag.save((error, savedTag) => {
                    if (error) {
                        reject(transform_mongoose_error(error, { capitalize: true, humanize: true }))
                    }
                    else {
                        resolve(savedTag);
                    }
                });
            }
            else {
                resolve(null)
            }
        });
    }

    /**
     * Delete Tag (Hard)
     * 
     * @param {any} query 
     * 
     * @returns {Promise<any>}
     */
    static deleteHard(query: any): Promise<any> {
        return new Promise((resolve, reject) => {
            Tag.deleteOne(query).exec((error, result) => {
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
     * Delete Tag (Soft)
     * 
     * @param {Tag} tag 
     * 
     * @returns {Promise<ITag>}
     */
    static deleteSoft(tag: ITag): Promise<ITag> {
        return new Promise((resolve, reject) => {
            if (tag) {
                tag.deleted_at = new Date();
                tag.save((error, deletedTag) => {
                    if (error) {
                        reject(transform_mongoose_error(error, { capitalize: true, humanize: true }))
                    }
                    else {
                        resolve(deletedTag);
                    }
                });
            } 
            else {
                resolve(null);
            } 
        });
    }
};

export default TagDAL;