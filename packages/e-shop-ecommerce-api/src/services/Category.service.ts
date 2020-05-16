import voca from 'voca';
import async from 'async';
import mongoose from 'mongoose';
import evalidate from 'evalidate';

import Messages from '../errors/Messages';
import { ICategory } from '../models/Category';
import CategoryDAL from '../dals/Category.dal';
import { NotFoundError, BadRequestError, InternalServerError } from '../errors/Errors';
import { IPaginationResponse, PaginationAdapter } from '../utilities/adapters/Pagination';

class CategoryService {

    /**
     * Create Category
     * 
     * @param {string} name
     * @param {string} parent
     * @param {string} image_url
     * @param {string} description
     * 
     * @returns {Promise<ICategory>}
     */
    static create(name: string, parent: string, image_url: string, description: string): Promise<ICategory> {
        return new Promise((resolve, reject) => {
            async.waterfall([
                (done: Function) => {
                    const Schema = new evalidate.schema({
                        name: evalidate.string().required(Messages.CATEGORY_NAME_REQUIRED)
                    });
                    const result = Schema.validate({ name: name, image_url: image_url });
                    if (result.isValid) {
                        done(null);
                    }
                    else {
                        done(new BadRequestError(result.errors));
                    }
                },
                (done: Function) => {
                    if (parent) {
                        CategoryDAL.findOne({ _id: parent})
                            .then((category: ICategory) => {
                                if (!category) {
                                    done(new BadRequestError([ { field: "parent", message: Messages.CATEGORY_NOT_FOUND } ]));
                                }
                                else {
                                    done(null, category);
                                }
                            })
                            .catch((error: any) => {
                                done(new InternalServerError(error));
                            });
                    }
                    else {
                        done(null);
                    }
                },
                (category: ICategory, done: Function) => {
                    let slug = voca.slugify(name);
                    CategoryDAL.create(name, slug, category ? category._id : null, image_url, voca.trim(description))
                        .then((category: ICategory) => {
                            resolve(category);
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

    /**
     * Find All Categories
     * 
     * @param {number} page
     * @param {number} limit
     * 
     * @returns {Promise<IPaginationResponse[]>}
     */
    static findAll(page: number = 1, limit: number = 25): Promise<IPaginationResponse> {
        return new Promise((resolve, reject) => {
            CategoryDAL.findMany({ deleted_at: null }, page, limit)
                .then((categories: ICategory[]) => {
                    resolve(PaginationAdapter(categories, page, limit));
                })
                .catch((error) => {
                    reject(new InternalServerError(error));
                });

        });
    }

    /**
     * Find Category By ID
     * 
     * @param {number} page
     * @param {number} limit
     * 
     * @returns {Promise<ICategory[]>}
     */
    static findByID(id: string): Promise<ICategory> {
        return new Promise((resolve, reject) => {
            if (!mongoose.isValidObjectId(id)) {
                resolve(null);
            }
            else {
                CategoryDAL.findOne({ _id: id })
                    .then((category) => {
                        resolve(category);
                    })
                    .catch((error) => {
                        reject(new InternalServerError(error));
                    });
            }
        });
    }

    /**
     * Update Category By ID
     * 
     * @param {string}  id 
     * @param {any}     payload 
     * 
     * @returns {Promise<ICategory>}
     */
    static update(id: string, payload: any = {}): Promise<ICategory> {
        return new Promise((resolve, reject) => {
            async.waterfall([
                (done: Function) => {
                    CategoryService.findByID(id)
                        .then((category: ICategory) => {
                            if (category) {
                                done(null, category);
                            }
                            else {
                                done(new NotFoundError(Messages.CATEGORY_NOT_FOUND));
                            }
                        })
                        .catch((error: any) => {
                            done(error);
                        });
                },
                (category: ICategory, done: Function) => {
                    if (payload && payload.parent) {
                        CategoryService.findByID(payload.parent)
                            .then((parent: ICategory) => {
                                if (parent) {
                                    done(null, category, parent);
                                }
                                else {
                                    done(new BadRequestError([ { field: "parent", message: Messages.CATEGORY_NOT_FOUND } ]));
                                }
                            })
                            .catch((error: any) => {
                                done(error);
                            });
                    }
                    else {
                        done(null, category, null);
                    }
                },
                (category: ICategory, parent: ICategory, done: Function) => {
                    if (payload && payload.name) {
                        payload = {
                            ...payload,
                            slug: voca.slugify(payload.name)
                        };
                    }
                    CategoryDAL.update(category, payload)
                        .then((category: ICategory) => {
                            resolve(category);
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

export default CategoryService;