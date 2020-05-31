import voca from 'voca';
import async from 'async';
import mongoose from 'mongoose';
import evalidate from 'evalidate';

import { IStore } from '../models/Store';
import { IProduct } from '../models/Product';
import Messages from '../errors/Messages';
import StoreService from './Store.service';
import ProductDAL from '../dals/Product.dal';
import { ICategory } from '../models/Category';
import CategoryService from './Category.service';
import { ImagePath } from '../utilities/image/ImagePathResolver';
import { NotFoundError, BadRequestError, InternalServerError } from '../errors/Errors';
import { IPaginationResponse, PaginationAdapter } from '../utilities/adapters/Pagination';


class ProductService {

    /**
     * Filter Categories
     * 
     * @param {any}     query
     * @param {number}  page
     * @param {number}  limit
     * 
     * @returns {Promise<IPaginationResponse[]>}
     */
    private static filter(query: any, page: number = 1, limit: number = 25): Promise<IPaginationResponse> {
        return new Promise((resolve, reject) => {
            async.waterfall([
                (done: Function) => {
                    ProductDAL.count(query)
                        .then((count) => {
                            done(null, count);
                        })
                        .catch((error) => {
                            done(new InternalServerError(error));
                        });
                },
                (count: number, done: Function) => {
                    ProductDAL.findMany(query, page, limit)
                        .then((products: IProduct[]) => {
                            resolve(PaginationAdapter(products, page, limit, count));
                        })
                        .catch((error) => {
                            done(new InternalServerError(error));
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
     * Create Product
     * 
     * @param {string}  name 
     * @param {number}  price 
     * @param {number}  quantity 
     * @param {string}  description 
     * @param {Array}   image_urls 
     * @param {string}  category
     * @param {string}  store   
     * @param {Array}   tags 
     * @param {number}  weight
     * @param {number}  width 
     * @param {number}  length 
     * @param {number}  height 
     * @param {boolean} is_visible
     * 
     * @returns {Promise<IProduct>}
     */
    static create(name: string, price: number, quantity: number, description: string, image_urls: ImagePath[], category: string, store: string, tags: string[], weight: number, width: number, length: number, height: number, is_visible: boolean = true): Promise<IProduct> {
        return new Promise((resolve, reject) => {
            async.waterfall([
                (done: Function) => {
                    CategoryService.findByID(category)
                        .then((category: ICategory) => {
                            if (!category) {
                                done(new BadRequestError([ { field: "category", message: Messages.CATEGORY_NOT_FOUND } ]));
                            }
                            else {
                                done(null, category);
                            }
                        })
                        .catch((error: any) => {
                            done(new InternalServerError(error));
                        });
                },
                (category: ICategory, done: Function) => {
                    StoreService.findByID(store)
                        .then((store: IStore) => {
                            if (!store) {
                                done(new BadRequestError([ { field: "store", message: Messages.STORE_NOT_FOUND } ]));
                            }
                            else {
                                done(null, category, store);
                            }
                        })
                        .catch((error: any) => {
                            done(new InternalServerError(error));
                        });
                },
                (category: ICategory, store: IStore, done: Function) => {
                    let slug = voca.slugify(name);
                    ProductDAL.create(name, slug, price, quantity, description, image_urls, category._id, store._id, tags, weight, width, length, height, is_visible, false)
                        .then((product: IProduct) => {
                            resolve(product);
                        })
                        .catch((error: any) => {
                            done(new BadRequestError(error));
                        });
                }
            ], (error: any) => {
                if (error) {
                    reject(error);
                }
            })
        });
    }

    /**
     * Find All Product
     * 
     * @param {string} term
     * @param {number} page
     * @param {number} limit
     * 
     * @returns {Promise<IPaginationResponse[]>}
     */
    static findAll(term: string = "", page: number = 1, limit: number = 25): Promise<IPaginationResponse> {
        return new Promise((resolve, reject) => {
            let query: any;
            if (term) {
                query = { $or: [ { name: { $regex: new RegExp(term, "i") } }, { description: { $regex: new RegExp(term, "i") } } ], deleted_at: null }
            }
            else {
                query = { deleted_at: null }
            }

            ProductService.filter(query, page, limit)
                .then((result: IPaginationResponse) => {
                    resolve(result);
                })
                .catch((error) => {
                    reject(new InternalServerError(error));
                });

        });
    }

    /**
     * Find Products By Store
     * 
     * @param {string} store
     * @param {number} page
     * @param {number} limit
     * 
     * @returns {Promise<IPaginationResponse[]>}
     */
    static findByStore(store: string, page: number = 1, limit: number = 25): Promise<IPaginationResponse> {
        return new Promise((resolve, reject) => {
            if (mongoose.isValidObjectId(store)) {
                let query: any = { store: store, deleted_at: null }
                ProductService.filter(query, page, limit)
                    .then((result: IPaginationResponse) => {
                        resolve(result);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            }
            else {
                resolve(PaginationAdapter([], page, limit, 0));
            }
        });
    }

    /**
     * Find Products By Category
     * 
     * @param {string} category
     * @param {number} page
     * @param {number} limit
     * 
     * @returns {Promise<IPaginationResponse[]>}
     */
    static findByCategory(category: string, page: number = 1, limit: number = 25): Promise<IPaginationResponse> {
        return new Promise((resolve, reject) => {
            if (mongoose.isValidObjectId(category)) {
                let query: any = { category: category, deleted_at: null }
                ProductService.filter(query, page, limit)
                    .then((result: IPaginationResponse) => {
                        resolve(result);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            }
            else {
                resolve(PaginationAdapter([], page, limit, 0));
            }
        });
    }

    /**
     * Find Product By ID
     * 
     * @param {number} page
     * @param {number} limit
     * 
     * @returns {Promise<IProduct[]>}
     */
    static findByID(id: string): Promise<IProduct> {
        return new Promise((resolve, reject) => {
            if (!mongoose.isValidObjectId(id)) {
                resolve(null);
            }
            else {
                ProductDAL.findOne({ _id: id })
                    .then((product) => {
                        resolve(product);
                    })
                    .catch((error) => {
                        reject(new InternalServerError(error));
                    });
            }
        });
    }

    /**
     * Update Product By ID
     * 
     * @param {string}  id 
     * @param {any}     payload 
     * 
     * @returns {Promise<IProduct>}
     */
    static update(id: string, payload: any = {}): Promise<IProduct> {
        return new Promise((resolve, reject) => {
            async.waterfall([
                (done: Function) => {
                    ProductService.findByID(id)
                        .then((product: IProduct) => {
                            if (product) {
                                done(null, product);
                            }
                            else {
                                done(new NotFoundError(Messages.PRODUCT_NOT_FOUND));
                            }
                        })
                        .catch((error: any) => {
                            done(new InternalServerError(error));
                        });
                },
                (product: IProduct, done: Function) => {
                    if (payload && payload.category) {
                        CategoryService.findByID(payload.category)
                            .then((category: ICategory) => {
                                if (category) {
                                    done(null, product, category);
                                }
                                else {
                                    done(new BadRequestError([ { field: "category", message: Messages.CATEGORY_NOT_FOUND } ]));
                                }
                            })
                            .catch((error: any) => {
                                done(new InternalServerError(error));
                            });
                    }
                    else {
                        done(null, product, null);
                    }
                },
                (product: IProduct, category: ICategory, done: Function) => {
                    if (payload && payload.store) {
                        StoreService.findByID(payload.store)
                            .then((store: IStore) => {
                                if (store) {
                                    done(null, product, category, store);
                                }
                                else {
                                    done(new BadRequestError([ { field: "store", message: Messages.STORE_NOT_FOUND } ]));
                                }
                            })
                            .catch((error: any) => {
                                done(new InternalServerError(error));
                            });
                    }
                    else {
                        done(null, product, category, null);
                    }
                },
                (product: IProduct, category: ICategory, store: IStore, done: Function) => {
                    ProductDAL.update(product, payload)
                        .then((updatedProduct: IProduct) => {
                            resolve(updatedProduct);
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
};

export default ProductService;