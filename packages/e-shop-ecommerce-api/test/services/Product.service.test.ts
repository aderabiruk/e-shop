import mongoose from 'mongoose';

import Messages from '../../src/errors/Messages';
import Store, { IStore } from '../../src/models/Store';
import Product, { IProduct } from '../../src/models/Product';
import Category, { ICategory } from '../../src/models/Category';
import ProductService from '../../src/services/Product.service';
import { createStore, createCategory, createProduct } from '../Generator';
import { IPaginationResponse } from '../../src/utilities/adapters/Pagination';

const app = require("../../src/app");

describe("Product.service", () => {
    let store: IStore;
    let category: ICategory;

    beforeAll(async () => {
        category = await createCategory("test-category", "test-category", mongoose.Types.ObjectId().toString(), "test-image-url", "test-category-description").save();
        store = await createStore("test-store", "test-store-email", "test-store-phone-number", mongoose.Types.ObjectId().toHexString(), "test-store-address", 125, 85).save();
    });

    describe("create", () => {
        it("Should return error if required fields are not provided!", async () => {
            try {
                await ProductService.create(null, null, null, null ,null, null, null, null, null, null, null, null, null);
                fail();
            }
            catch (error) {
                expect(error.statusCode).toBe(400);
                expect(error.payload.errors).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "name",
                        message: Messages.PRODUCT_NAME_REQUIRED
                    })
                ]));
                expect(error.payload.errors).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "price",
                        message: Messages.PRODUCT_PRICE_REQUIRED
                    })
                ]));
                expect(error.payload.errors).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "quantity",
                        message: Messages.PRODUCT_QUANTITY_REQUIRED
                    })
                ]));
                expect(error.payload.errors).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "category",
                        message: Messages.PRODUCT_CATEOGRY_REQUIRED
                    })
                ]));
                expect(error.payload.errors).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "store",
                        message: Messages.PRODUCT_STORE_REQUIRED
                    })
                ]));
                expect(error.payload.errors).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "weight",
                        message: Messages.PRODUCT_WEIGHT_REQUIRED
                    })
                ]));
                expect(error.payload.errors).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "width",
                        message: Messages.PRODUCT_WIDTH_REQUIRED
                    })
                ]));
                expect(error.payload.errors).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "height",
                        message: Messages.PRODUCT_HEIGHT_REQUIRED
                    })
                ]));
                expect(error.payload.errors).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "length",
                        message: Messages.PRODUCT_LENGTH_REQUIRED
                    })
                ]));
            }
        });

        it("Should return error if category doesn't exist!", async () => {
            try {
                await ProductService.create("test-product", 100, 100, null, [], mongoose.Types.ObjectId().toHexString(), mongoose.Types.ObjectId().toHexString(), [], 100, 100, 100, 100);
                fail();
            }
            catch (error) {
                expect(error.statusCode).toBe(400);
                expect(error.payload.errors).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "category",
                        message: Messages.CATEGORY_NOT_FOUND
                    })
                ]));
                
            }
        });

        it("Should return error if category doesn't exist!", async () => {
            try {
                await ProductService.create("test-product", 100, 100, null, [], category._id.toString(), mongoose.Types.ObjectId().toHexString(), [], 100, 100, 100, 100);
                fail();
            }
            catch (error) {
                expect(error.statusCode).toBe(400);
                expect(error.payload.errors).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "store",
                        message: Messages.STORE_NOT_FOUND
                    })
                ]));
                
            }
        });

        it("Should return error if invalid input provided!", async () => {
            let product: IProduct = await ProductService.create("test-product", 100, 100, "test-product-description", [], category._id.toString(), store._id.toString(), [], 100, 100, 100, 100);

            expect(product.name).toBe("test-product");
            expect(product.slug).toBe("test-product");
            expect(product.price).toBe(100);
            expect(product.quantity).toBe(100);
            expect(product.description).toBe("test-product-description");
            expect(product.image_urls.length).toBe(0);
            expect(product.store).toBeTruthy();
            expect(product.category).toBeTruthy();
            expect(product.tags.length).toBe(0);
            expect(product.weight).toBe(100);
            expect(product.dimension.width).toBe(100);
            expect(product.dimension.length).toBe(100);
            expect(product.dimension.height).toBe(100);
            expect(product.is_visible).toBeTruthy();
            expect(product.is_out_of_stock).toBeFalsy();
        });
    });

    describe("findAll", () => {
        it("Should return products", async () => {
            await createProduct("test-product", "test-product", 100, 100, "test-product-description", ["image-url"], mongoose.Types.ObjectId().toHexString(), mongoose.Types.ObjectId().toHexString(), [mongoose.Types.ObjectId().toHexString()], 250, 10, 10, 10, true, false).save();

            let response: IPaginationResponse = await ProductService.findAll();
            expect(response.data.length).toBeGreaterThan(0);
            expect(response.metadata.pagination.page).toBe(1);
            expect(response.metadata.pagination.limit).toBe(25);
        });
    });

    describe("findOne", () => {
        it("Should return null if id is invalid", async () => {
            let product: IProduct = await ProductService.findByID("INVALID-ID");
            expect(product).toBeNull();
        });

        it("Should return null if product doesn't exist", async () => {
            let product: IProduct = await ProductService.findByID(mongoose.Types.ObjectId().toHexString());
            expect(product).toBeNull();
        });

        it("Should return product", async () => {
            let product: IProduct = await createProduct("test-product", "test-product", 100, 100, "test-product-description", ["image-url"], mongoose.Types.ObjectId().toHexString(), mongoose.Types.ObjectId().toHexString(), [mongoose.Types.ObjectId().toHexString()], 250, 10, 10, 10, true, false).save();

            let fetchedProduct: IProduct = await ProductService.findByID(product._id );
            expect(fetchedProduct.name).toBe("test-product");
            expect(fetchedProduct.slug).toBe("test-product");
            expect(fetchedProduct.price).toBe(100);
            expect(fetchedProduct.quantity).toBe(100);
            expect(fetchedProduct.description).toBe("test-product-description");
            expect(fetchedProduct.image_urls.length).toBe(1);
            expect(fetchedProduct.store).toBeTruthy();
            expect(fetchedProduct.category).toBeTruthy();
            expect(fetchedProduct.tags.length).toBe(1);
            expect(fetchedProduct.weight).toBe(250);
            expect(fetchedProduct.dimension.width).toBe(10);
            expect(fetchedProduct.dimension.length).toBe(10);
            expect(fetchedProduct.dimension.height).toBe(10);
            expect(fetchedProduct.is_visible).toBeTruthy();
            expect(fetchedProduct.is_out_of_stock).toBeFalsy();
        });
    });

    describe("update", () => {
        it("Should return error if product doesn't exist!", async () => {
            try {
                let product: IProduct = await ProductService.update("INVALID-ID", {});
                fail();
            }
            catch (error) {
                expect(error.statusCode).toBe(404);
                expect(error.payload.errors).toEqual(expect.arrayContaining([
                    Messages.PRODUCT_NOT_FOUND
                ]));
            }
        });

        it("Should return error if category doesn't exist!", async () => {
            let product: IProduct = await createProduct("test-product", "test-product", 100, 100, "test-product-description", ["image-url"], mongoose.Types.ObjectId().toHexString(), mongoose.Types.ObjectId().toHexString(), [mongoose.Types.ObjectId().toHexString()], 250, 10, 10, 10, true, false).save();

            try {
                await ProductService.update(product._id, { category: mongoose.Types.ObjectId() });
                fail();
            }
            catch (error) {
                expect(error.statusCode).toBe(400);
                expect(error.payload.errors).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "category",
                        message: Messages.CATEGORY_NOT_FOUND
                    })
                ]));
            }
        });

        it("Should return error if store doesn't exist!", async () => {
            let product: IProduct = await createProduct("test-product", "test-product", 100, 100, "test-product-description", ["image-url"], mongoose.Types.ObjectId().toHexString(), mongoose.Types.ObjectId().toHexString(), [mongoose.Types.ObjectId().toHexString()], 250, 10, 10, 10, true, false).save();

            try {
                await ProductService.update(product._id, { store: mongoose.Types.ObjectId() });
                fail();
            }
            catch (error) {
                expect(error.statusCode).toBe(400);
                expect(error.payload.errors).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "store",
                        message: Messages.STORE_NOT_FOUND
                    })
                ]));
            }
        });

        it("Should return error if price, quantity, weight, width, height and length are invalid!", async () => {
            let product: IProduct = await createProduct("test-product", "test-product", 100, 100, "test-product-description", ["image-url"], mongoose.Types.ObjectId().toHexString(), mongoose.Types.ObjectId().toHexString(), [mongoose.Types.ObjectId().toHexString()], 250, 10, 10, 10, true, false).save();

            try {
                await ProductService.update(product._id, { price: 'INVALID-PRICE', quantity: 'INVALID-QUANTITY', weight: 'INVALID-WEIGHT', width: 'INVALID-WIDTH', height: 'INVALID-HEIGHT', length: 'INVALID-LENGTH' });
                fail();
            }
            catch (error) {
                expect(error.statusCode).toBe(400);
                expect(error.payload.errors).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "price",
                    })
                ]));
                expect(error.payload.errors).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "quantity",
                    })
                ]));
                expect(error.payload.errors).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "weight",
                    })
                ]));
                expect(error.payload.errors).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "dimension.width",
                    })
                ]));
                expect(error.payload.errors).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "dimension.height",
                    })
                ]));
                expect(error.payload.errors).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "dimension.length",
                    })
                ]));
            }
        });

        it("Shouldn't update if payload is empty!", async () => {
            let product: IProduct = await createProduct("test-product", "test-product", 100, 100, "test-product-description", ["image-url"], mongoose.Types.ObjectId().toHexString(), mongoose.Types.ObjectId().toHexString(), [mongoose.Types.ObjectId().toHexString()], 250, 10, 10, 10, true, false).save();

            let updatedProduct = await ProductService.update(product._id, {  });
            expect(updatedProduct.name).toBe("test-product");
            expect(updatedProduct.slug).toBe("test-product");
            expect(updatedProduct.price).toBe(100);
            expect(updatedProduct.quantity).toBe(100);
            expect(updatedProduct.description).toBe("test-product-description");
            expect(updatedProduct.image_urls.length).toBe(1);
            expect(updatedProduct.store).toBeTruthy();
            expect(updatedProduct.category).toBeTruthy();
            expect(updatedProduct.tags.length).toBe(1);
            expect(updatedProduct.weight).toBe(250);
            expect(updatedProduct.dimension.width).toBe(10);
            expect(updatedProduct.dimension.length).toBe(10);
            expect(updatedProduct.dimension.height).toBe(10);
            expect(updatedProduct.is_visible).toBeTruthy();
            expect(updatedProduct.is_out_of_stock).toBeFalsy();            
        });

        it("Should return error if price, quantity, weight, width, height and length are invalid!", async () => {
            let product: IProduct = await createProduct("test-product", "test-product", 100, 100, "test-product-description", ["image-url"], mongoose.Types.ObjectId().toHexString(), mongoose.Types.ObjectId().toHexString(), [mongoose.Types.ObjectId().toHexString()], 250, 10, 10, 10, true, false).save();

            let updatedProduct = await ProductService.update(product._id, { description: "test-product-description-new", weight: 400, width: 20, image_urls: [] });
            expect(updatedProduct.name).toBe("test-product");
            expect(updatedProduct.slug).toBe("test-product");
            expect(updatedProduct.price).toBe(100);
            expect(updatedProduct.quantity).toBe(100);
            expect(updatedProduct.description).toBe("test-product-description-new");
            expect(updatedProduct.image_urls.length).toBe(0);
            expect(updatedProduct.store).toBeTruthy();
            expect(updatedProduct.category).toBeTruthy();
            expect(updatedProduct.tags.length).toBe(1);
            expect(updatedProduct.weight).toBe(400);
            expect(updatedProduct.dimension.width).toBe(20);
            expect(updatedProduct.dimension.length).toBe(10);
            expect(updatedProduct.dimension.height).toBe(10);
            expect(updatedProduct.is_visible).toBeTruthy();
            expect(updatedProduct.is_out_of_stock).toBeFalsy();            
        });
    });

    afterEach(async () => {
        await Product.deleteMany({"name": "test-product"});
    });

    afterAll(async () => {
        await Store.deleteMany({ name: "test-store"}); 
        await Category.deleteMany({ name: "test-category"});

        await mongoose.connection.close();
    });
});