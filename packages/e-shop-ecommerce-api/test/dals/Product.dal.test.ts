import mongoose from 'mongoose';

import { createProduct } from '../Generator';
import ProductDAL from '../../src/dals/Product.dal';
import Product, { IProduct } from '../../src/models/Product';

const app = require("../../src/app");

describe("Product DAL", () => {
    
    describe("create", () => {
        it("Should return error if required fields are not provided!", async () => {
            try {
                await ProductDAL.create(null, null, null, null ,null, null, null, null, null, null, null, null, null, null, null);
                fail();
            }
            catch (error) {
                expect(error).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "name",
                    })
                ]));
                expect(error).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "slug",
                    })
                ]));
                expect(error).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "price",
                    })
                ]));
                expect(error).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "quantity",
                    })
                ]));
            }
        });

        it("Should create store if no errors", async () => {
            let product = await ProductDAL.create("test-product", "test-product", 100, 100, "test-product-description", [], mongoose.Types.ObjectId().toHexString(), mongoose.Types.ObjectId().toHexString(), [], null, null, null, null, true, false);
            
            expect(product.name).toBe("test-product");
            expect(product.slug).toBe("test-product");
            expect(product.price).toBe(100);
            expect(product.quantity).toBe(100);
            expect(product.description).toBe("test-product-description");
            expect(product.image_urls.length).toBe(0);
            expect(product.store).toBeTruthy();
            expect(product.category).toBeTruthy();
            expect(product.tags.length).toBe(0);
            expect(product.weight).toBe(0);
            expect(product.dimension.width).toBe(0);
            expect(product.dimension.length).toBe(0);
            expect(product.dimension.height).toBe(0);
            expect(product.is_visible).toBeTruthy();
            expect(product.is_out_of_stock).toBeFalsy();
        });

        it("Should create store if no errors", async () => {
            let product = await ProductDAL.create("test-product", "test-product", 100, 100, "test-product-description", [], mongoose.Types.ObjectId().toHexString(), mongoose.Types.ObjectId().toHexString(), [mongoose.Types.ObjectId().toHexString()], 250, 10, 10, 10, true, false);
            
            expect(product.name).toBe("test-product");
            expect(product.slug).toBe("test-product");
            expect(product.price).toBe(100);
            expect(product.quantity).toBe(100);
            expect(product.description).toBe("test-product-description");
            expect(product.image_urls.length).toBe(0);
            expect(product.store).toBeTruthy();
            expect(product.category).toBeTruthy();
            expect(product.tags.length).toBe(1);
            expect(product.weight).toBe(250);
            expect(product.dimension.width).toBe(10);
            expect(product.dimension.length).toBe(10);
            expect(product.dimension.height).toBe(10);
            expect(product.is_visible).toBeTruthy();
            expect(product.is_out_of_stock).toBeFalsy();
        });
    });

    describe("count", () => {
        it("Should return number of products", async () => {
            await createProduct("test-product", "test-product", 100, 100, "test-product-description", [], mongoose.Types.ObjectId().toHexString(), mongoose.Types.ObjectId().toHexString(), [mongoose.Types.ObjectId().toHexString()], 250, 10, 10, 10, true, false).save();

            let count: number = await ProductDAL.count({});
            expect(count).toBeGreaterThan(0);
        });
    });

    describe("findMany", () => {
        it("Should return products", async () => {
            await createProduct("test-product", "test-product", 100, 100, "test-product-description", [], mongoose.Types.ObjectId().toHexString(), mongoose.Types.ObjectId().toHexString(), [mongoose.Types.ObjectId().toHexString()], 250, 10, 10, 10, true, false).save();

            let products: IProduct[] = await ProductDAL.findMany({});
            expect(products.length).toBeGreaterThan(0);
        });

        it("Should filter products by category (Empty Response)", async () => {
            await createProduct("test-product", "test-product", 100, 100, "test-product-description", [], mongoose.Types.ObjectId().toHexString(), mongoose.Types.ObjectId().toHexString(), [mongoose.Types.ObjectId().toHexString()], 250, 10, 10, 10, true, false).save();

            let products: IProduct[] = await ProductDAL.findMany({category: mongoose.Types.ObjectId()});
            expect(products.length).toBe(0);
        });

        it("Should filter products by category (With Response)", async () => {
            let category = mongoose.Types.ObjectId();
            await createProduct("test-product", "test-product", 100, 100, "test-product-description", [], category.toHexString(), mongoose.Types.ObjectId().toHexString(), [mongoose.Types.ObjectId().toHexString()], 250, 10, 10, 10, true, false).save();

            let products: IProduct[] = await ProductDAL.findMany({ category: category.toHexString() });
            expect(products.length).toBe(1);
        });

        it("Should filter products by store (Empty Response)", async () => {
            await createProduct("test-product", "test-product", 100, 100, "test-product-description", [], mongoose.Types.ObjectId().toHexString(), mongoose.Types.ObjectId().toHexString(), [mongoose.Types.ObjectId().toHexString()], 250, 10, 10, 10, true, false).save();

            let products: IProduct[] = await ProductDAL.findMany({store: mongoose.Types.ObjectId()});
            expect(products.length).toBe(0);
        });

        it("Should filter products by store (With Response)", async () => {
            let store = mongoose.Types.ObjectId();
            await createProduct("test-product", "test-product", 100, 100, "test-product-description", [], mongoose.Types.ObjectId().toHexString(), store.toHexString(), [mongoose.Types.ObjectId().toHexString()], 250, 10, 10, 10, true, false).save();

            let products: IProduct[] = await ProductDAL.findMany({ store: store.toHexString() });
            expect(products.length).toBe(1);
        });
    });

    describe("findOne", () => {
        it("Should return null if product doesn't exist", async () => {
            let product: IProduct = await ProductDAL.findOne({ _id: mongoose.Types.ObjectId() });
            expect(product).toBeNull();
        });

        it("Should return product if it exists", async () => {
            let product = await createProduct("test-product", "test-product", 100, 100, "test-product-description", [], mongoose.Types.ObjectId().toHexString(), mongoose.Types.ObjectId().toHexString(), [mongoose.Types.ObjectId().toHexString()], 250, 10, 10, 10, true, false).save();
            
            let fetchedProduct: IProduct = await ProductDAL.findOne({ _id: product._id });
            expect(fetchedProduct.name).toBe("test-product");
            expect(fetchedProduct.slug).toBe("test-product");
            expect(fetchedProduct.price).toBe(100);
            expect(fetchedProduct.quantity).toBe(100);
            expect(fetchedProduct.description).toBe("test-product-description");
            expect(fetchedProduct.image_urls.length).toBe(0);
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
        it("Should return null if product doesn't exist", async () => {
            let product: IProduct = await ProductDAL.update(null, {});
            expect(product).toBeNull();
        });

        it("Shouldn't update if payload is empty", async () => {
            let product = await createProduct("test-product", "test-product", 100, 100, "test-product-description", [], mongoose.Types.ObjectId().toHexString(), mongoose.Types.ObjectId().toHexString(), [mongoose.Types.ObjectId().toHexString()], 250, 10, 10, 10, true, false).save();
            
            let updateProduct: IProduct = await ProductDAL.update(product, {  });
            expect(updateProduct.name).toBe("test-product");
            expect(updateProduct.slug).toBe("test-product");
            expect(updateProduct.price).toBe(100);
            expect(updateProduct.quantity).toBe(100);
            expect(updateProduct.description).toBe("test-product-description");
            expect(updateProduct.image_urls.length).toBe(0);
            expect(updateProduct.store).toBeTruthy();
            expect(updateProduct.category).toBeTruthy();
            expect(updateProduct.tags.length).toBe(1);
            expect(updateProduct.weight).toBe(250);
            expect(updateProduct.dimension.width).toBe(10);
            expect(updateProduct.dimension.length).toBe(10);
            expect(updateProduct.dimension.height).toBe(10);
            expect(updateProduct.is_visible).toBeTruthy();
            expect(updateProduct.is_out_of_stock).toBeFalsy();
        });

        it("Should update product", async () => {
            let product = await createProduct("test-product", "test-product", 100, 100, "test-product-description", [], mongoose.Types.ObjectId().toHexString(), mongoose.Types.ObjectId().toHexString(), [mongoose.Types.ObjectId().toHexString()], 250, 10, 10, 10, true, false).save();
            
            let updateProduct: IProduct = await ProductDAL.update(product, { description: "test-product-description-new", weight: 400, width: 20, image_urls: [] });
            expect(updateProduct.name).toBe("test-product");
            expect(updateProduct.slug).toBe("test-product");
            expect(updateProduct.price).toBe(100);
            expect(updateProduct.quantity).toBe(100);
            expect(updateProduct.description).toBe("test-product-description-new");
            expect(updateProduct.image_urls.length).toBe(0);
            expect(updateProduct.store).toBeTruthy();
            expect(updateProduct.category).toBeTruthy();
            expect(updateProduct.tags.length).toBe(1);
            expect(updateProduct.weight).toBe(400);
            expect(updateProduct.dimension.width).toBe(20);
            expect(updateProduct.dimension.length).toBe(10);
            expect(updateProduct.dimension.height).toBe(10);
            expect(updateProduct.is_visible).toBeTruthy();
            expect(updateProduct.is_out_of_stock).toBeFalsy();
        });
    });

    describe("deleteHard", () => {
        it("Should return 0 deletedCount if product doesn't exist", async () => {
            let result: any = await ProductDAL.deleteHard({ _id: mongoose.Types.ObjectId().toHexString() });
            expect(result.deletedCount).toBe(0);
        });

        it("Should delete product if it exists", async () => {
            let product = await createProduct("test-product", "test-product", 100, 100, "test-product-description", [], mongoose.Types.ObjectId().toHexString(), mongoose.Types.ObjectId().toHexString(), [mongoose.Types.ObjectId().toHexString()], 250, 10, 10, 10, true, false).save();

            let result: any = await ProductDAL.deleteHard({ _id: product._id.toHexString() });
            expect(result.deletedCount).toBe(1);
        });
    });

    describe("deleteSoft", () => {
        it("Should return null if null product is passed", async () => {
            let product: IProduct = await ProductDAL.deleteSoft(null);
            expect(product).toBeNull();
        });

        it("Should soft delete product if it exists", async () => {
            let product = await createProduct("test-product", "test-product", 100, 100, "test-product-description", [], mongoose.Types.ObjectId().toHexString(), mongoose.Types.ObjectId().toHexString(), [mongoose.Types.ObjectId().toHexString()], 250, 10, 10, 10, true, false).save();

            let deletedStore: IProduct = await ProductDAL.deleteSoft(product);
            expect(deletedStore).not.toBeNull();
            expect(deletedStore.deleted_at).toBeTruthy();
        });
    });

    afterEach(async () => {
        await Product.deleteMany({"name": "test-product"});
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

});