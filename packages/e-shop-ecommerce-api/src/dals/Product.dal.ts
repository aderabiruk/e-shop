import transform_mongoose_error from 'mongoose-validation-error-handler';

import Product, { IProduct } from '../models/Product';

class ProductDAL {

    /**
     * Create Product
     * 
     * @param {string}  name 
     * @param {string}  slug 
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
     * @param {boolean} is_out_of_stock
     * 
     * @returns {Promise<IProduct>}
     */
    static create(name: string, slug: string, price: number, quantity: number, description: string, image_urls: string[], category: string, store: string, tags: string[], weight: number, width: number, length: number, height: number, is_visible: boolean, is_out_of_stock: boolean): Promise<IProduct> {
        return new Promise((resolve, reject) => {
            let product = new Product();
            product.name = name;
            product.slug = slug;
            product.price = price;
            product.quantity = quantity;
            product.description = description;
            product.image_urls = image_urls;
            product.category = category;
            product.store = store;
            product.tags = tags;
            product.weight = weight ? weight : 0;
            product.dimension = {
                width: width ? width : 0,
                length: length ? length : 0,
                height: height ? height : 0
            };
            product.is_visible = is_visible;
            product.is_out_of_stock = is_out_of_stock;
            product.save((error, savedProduct) => {
                if (error) {
                    reject(transform_mongoose_error(error, { capitalize: true, humanize: true }))
                }
                else {
                    resolve(savedProduct);
                }
            });
        });
    }

    /**
     * Find Many Products
     * 
     * @param {any}     query 
     * @param {number}  page 
     * @param {number}  limit 
     * 
     * @returns {Promise<IProduct[]>}
     */
    static findMany(query: any, page: number = 1, limit: number = 25): Promise<IProduct[]> {
        return new Promise((resolve, reject) => {
            Product.find(query).limit(limit).skip((page - 1) * limit).exec((error, products) => {
                if (error) {
                    reject(transform_mongoose_error(error, { capitalize: true, humanize: true }))
                }
                else {
                    resolve(products);
                }
            });
        });
    }

    /**
     * Find One Store
     * 
     * @param {any} query 
     * 
     * @returns {Promise<IProduct>}
     */
    static findOne(query: any): Promise<IProduct> {
        return new Promise((resolve, reject) => {
            Product.findOne(query).exec((error, product) => {
                if (error) {
                    reject(transform_mongoose_error(error, { capitalize: true, humanize: true }))
                }
                else {
                    resolve(product);
                }
            });
        });
    }

    /**
     * Update Product
     * 
     * @param {Product} product 
     * @param {any}     payload
     * 
     * @returns {Promise<IProduct>}
     */
    static update(product: IProduct, payload: any): Promise<IProduct> {
        return new Promise((resolve, reject) => {
            if (product) {
                product.name = payload.name ? payload.name : product.name;
                product.slug = payload.slug ? payload.slug : product.slug;
                product.price = payload.price ? payload.price : product.price;
                product.quantity = payload.quantity ? payload.quantity : product.quantity;
                product.description = payload.description ? payload.description : product.description;
                product.image_urls = payload.image_urls ? payload.image_urls : product.image_urls;
                product.category = payload.category ? payload.category : product.category;
                product.store = payload.store ? payload.store : product.store;
                product.tags = payload.tags ? payload.tags : product.tags;
                product.weight = payload.weight ? payload.weight : product.weight;
                product.dimension.width = payload.width ? payload.width : product.dimension.width;
                product.dimension.length = payload.length ? payload.length : product.dimension.length;
                product.dimension.height = payload.height ? payload.height : product.dimension.height;
                product.is_visible = payload.is_visible ? payload.is_visible : product.is_visible;
                product.is_out_of_stock = payload.is_out_of_stock ? payload.is_out_of_stock : product.is_out_of_stock;
                
                product.updated_at = new Date();
                product.save((error, updatedProduct) => {
                    if (error) {
                        reject(transform_mongoose_error(error, { capitalize: true, humanize: true }))
                    }
                    else {
                        resolve(updatedProduct);
                    }
                });
            }
            else {
                resolve(null)
            }
        });
    }

    /**
     * Delete Product (Hard)
     * 
     * @param {any} query 
     * 
     * @returns {Promise<any>}
     */
    static deleteHard(query: any): Promise<any> {
        return new Promise((resolve, reject) => {
            Product.deleteOne(query).exec((error, result) => {
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
     * Delete Product (Soft)
     * 
     * @param {Product} product 
     * 
     * @returns {Promise<any>}
     */
    static deleteSoft(product: IProduct): Promise<IProduct> {
        return new Promise((resolve, reject) => {
            if (product) {
                product.deleted_at = new Date();
                product.save((error, deletedProduct) => {
                    if (error) {
                        reject(transform_mongoose_error(error, { capitalize: true, humanize: true }))
                    }
                    else {
                        resolve(deletedProduct);
                    }
                });
            } 
            else {
                resolve(null);
            } 
        });
    }
}

export default ProductDAL;