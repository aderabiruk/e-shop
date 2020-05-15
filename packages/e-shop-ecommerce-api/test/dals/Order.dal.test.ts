import moment from 'moment';
import mongoose from 'mongoose';

import OrderDAL from '../../src/dals/Order.dal';
import { IAddress } from '../../src/models/Location';
import { IOrderPrice } from '../../src/models/Price';
import Order, { IOrder, IOrderItem } from '../../src/models/Order';
import { createOrder, createProduct } from '../Generator';
import Product, { IProduct } from '../../src/models/Product';
import { OrderStatus } from '../../src/utilities/constants/General';

const app = require("../../src/app");

const address: IAddress = {
    country: "Ethiopia",
    province: "Addis Ababa",
    city: "Addis Ababa",
    zip_code: "0001",
    address: "Menelik Hospital"
};

const price: IOrderPrice = {
    subtotal: 100,
    shipping_price: 10,
    tax: 5,
    total_price: 115
};

describe("Order.dal", () => {
    let product1: IProduct, product2: IProduct;

    beforeAll(async () => {
        product1 = await createProduct("test-product", "test-product", 100, 100, "test-product-description", ["image-url"], mongoose.Types.ObjectId().toHexString(), mongoose.Types.ObjectId().toHexString(), [mongoose.Types.ObjectId().toHexString()], 250, 10, 10, 10, true, false).save();
        product2 = await createProduct("test-product", "test-product", 100, 100, "test-product-description", ["image-url"], mongoose.Types.ObjectId().toHexString(), mongoose.Types.ObjectId().toHexString(), [mongoose.Types.ObjectId().toHexString()], 250, 10, 10, 10, true, false).save();
    });

    describe("create", () => {
        it("Should return error if required fields are not provided!", async () => {
            try {
                await OrderDAL.create(null, null, null, null, null, null, null, null, null, null);
                fail();
            }
            catch (error) {
                expect(error).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "number",
                    })
                ]));
                expect(error).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "status",
                    })
                ]));
                expect(error).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "billing_address",
                    })
                ]));
                expect(error).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "shipping_address",
                    })
                ]));
                expect(error).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "price",
                    })
                ]));
                expect(error).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "items",
                    })
                ]));
            }
        });

        it("Should return error if billing address is not provided!", async () => {
            try {
                await OrderDAL.create("00000", mongoose.Types.ObjectId().toHexString(), null, address, OrderStatus.PENDING, mongoose.Types.ObjectId().toHexString(), mongoose.Types.ObjectId().toHexString(), [], price, null);
                fail();
            }
            catch (error) {
                expect(error).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "billing_address",
                    })
                ]));
                expect(error).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "items",
                    })
                ]));
            }
        });

        it("Should return error if shipping address is not provided!", async () => {
            try {
                await OrderDAL.create("00000", mongoose.Types.ObjectId().toHexString(), address, null, OrderStatus.PENDING, mongoose.Types.ObjectId().toHexString(), mongoose.Types.ObjectId().toHexString(), [], price, null);
                fail();
            }
            catch (error) {
                expect(error).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "shipping_address",
                    })
                ]));
                expect(error).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "items",
                    })
                ]));
            }
        });

        it("Should return error if invalid shipping address is provided!", async () => {
            try {
                await OrderDAL.create("00000", mongoose.Types.ObjectId().toHexString(), { address: null, city: null, country: null, province: null, zip_code: null }, address, OrderStatus.PENDING, mongoose.Types.ObjectId().toHexString(), mongoose.Types.ObjectId().toHexString(), [], price, null);
                fail();
            }
            catch (error) {
                expect(error).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "billing_address.address",
                    })
                ]));
                expect(error).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "billing_address.city",
                    })
                ]));
                expect(error).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "billing_address.country",
                    })
                ]));
                expect(error).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "billing_address.province",
                    })
                ]));
                expect(error).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "billing_address.zip_code",
                    })
                ]));
                expect(error).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "items",
                    })
                ]));
            }
        });

        it("Should return error if invalid status is provided!", async () => {
            try {
                await OrderDAL.create("00000", mongoose.Types.ObjectId().toHexString(), address, address, "INVALID", mongoose.Types.ObjectId().toHexString(), mongoose.Types.ObjectId().toHexString(), [], price, null);
                fail();
            }
            catch (error) {
                expect(error).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "status",
                    })
                ]));
                expect(error).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "items",
                    })
                ]));
            }
        });

        it("Should return error if price is not provided!", async () => {
            try {
                await OrderDAL.create("00000", mongoose.Types.ObjectId().toHexString(), address, address, OrderStatus.PENDING, mongoose.Types.ObjectId().toHexString(), mongoose.Types.ObjectId().toHexString(), [], null, null);
                fail();
            }
            catch (error) {
                expect(error).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "price",
                    })
                ]));
                expect(error).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "items",
                    })
                ]));
            }
        });

        it("Should return error if invalid items is provided!", async () => {
            try {
                await OrderDAL.create("00000", mongoose.Types.ObjectId().toHexString(), address, address, OrderStatus.PENDING, mongoose.Types.ObjectId().toHexString(), mongoose.Types.ObjectId().toHexString(), [{ product: null, quantity: null }], price, null);
                fail();
            }
            catch (error) {
                expect(error).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "items.product",
                    })
                ]));
            }
        });

        it("Should create order if all fields are valid", async () => {
            let order: IOrder = await OrderDAL.create("00000", mongoose.Types.ObjectId().toHexString(), address, address, OrderStatus.PENDING, mongoose.Types.ObjectId().toHexString(), mongoose.Types.ObjectId().toHexString(), [{ product: product1._id, quantity: 0 }], price, null);

            expect(order.number).toBe("00000");
            expect(order.status).toBe(OrderStatus.PENDING);
            expect(order.billing_address.country).toBe(address.country);
            expect(order.billing_address.city).toBe(address.city);
            expect(order.billing_address.province).toBe(address.province);
            expect(order.billing_address.zip_code).toBe(address.zip_code);
            expect(order.billing_address.address).toBe(address.address);
            expect(order.shipping_address.country).toBe(address.country);
            expect(order.shipping_address.city).toBe(address.city);
            expect(order.shipping_address.province).toBe(address.province);
            expect(order.shipping_address.zip_code).toBe(address.zip_code);
            expect(order.shipping_address.address).toBe(address.address);
        });
        
    });

    describe("findMany", () => {
        it("Should return orders", async () => {
            await createOrder("00000", mongoose.Types.ObjectId().toHexString(), address, address, OrderStatus.PENDING, mongoose.Types.ObjectId().toHexString(), mongoose.Types.ObjectId().toHexString(), [{ product: product1._id, quantity: 0 }], price, null).save();

            let orders: IOrder[] = await OrderDAL.findMany({});
            expect(orders.length).toBeGreaterThan(0);
        });

        it("Should filter orders by number", async () => {
            await createOrder("00000", mongoose.Types.ObjectId().toHexString(), address, address, OrderStatus.PENDING, mongoose.Types.ObjectId().toHexString(), mongoose.Types.ObjectId().toHexString(), [{ product: product1._id, quantity: 0 }], price, null).save();

            let orders: IOrder[] = await OrderDAL.findMany({ number: "00000" });
            expect(orders.length).toBeGreaterThan(0);
        });
    });

    describe("findOne", () => {
        it("Should return null if order doesn't exist", async () => {
            let order: IOrder = await OrderDAL.findOne({ _id: mongoose.Types.ObjectId() });
            expect(order).toBeNull();
        });

        it("Should return order", async () => {
            let order: IOrder = await createOrder("00000", mongoose.Types.ObjectId().toHexString(), address, address, OrderStatus.PENDING, mongoose.Types.ObjectId().toHexString(), mongoose.Types.ObjectId().toHexString(), [{ product: product1._id, quantity: 0 }], price, null).save();

            let fetchedOrder: IOrder = await OrderDAL.findOne({ _id: order._id });
            expect(fetchedOrder).not.toBeNull();
            expect(fetchedOrder.number).toBe("00000");
            expect(fetchedOrder.status).toBe(OrderStatus.PENDING);
            expect(fetchedOrder.billing_address.country).toBe(address.country);
            expect(fetchedOrder.billing_address.city).toBe(address.city);
            expect(fetchedOrder.billing_address.province).toBe(address.province);
            expect(fetchedOrder.billing_address.zip_code).toBe(address.zip_code);
            expect(fetchedOrder.billing_address.address).toBe(address.address);
            expect(fetchedOrder.shipping_address.country).toBe(address.country);
            expect(fetchedOrder.shipping_address.city).toBe(address.city);
            expect(fetchedOrder.shipping_address.province).toBe(address.province);
            expect(fetchedOrder.shipping_address.zip_code).toBe(address.zip_code);
            expect(fetchedOrder.shipping_address.address).toBe(address.address);
        });
    });

    describe("update", () => {
        it("Should return null if order doesn't exist", async () => {
            let order: IOrder = await OrderDAL.update(null, {});
            expect(order).toBeNull();
        });

        it("Shouldn't update if payload is empty", async () => {
            let order: IOrder = await createOrder("00000", mongoose.Types.ObjectId().toHexString(), address, address, OrderStatus.PENDING, mongoose.Types.ObjectId().toHexString(), mongoose.Types.ObjectId().toHexString(), [{ product: product1._id, quantity: 0 }], price, null).save();
            
            let updateOrder: IOrder = await OrderDAL.update(order, {  });
            expect(updateOrder).not.toBeNull();
            expect(updateOrder.number).toBe("00000");
            expect(updateOrder.status).toBe(OrderStatus.PENDING);
            expect(updateOrder.billing_address.country).toBe(address.country);
            expect(updateOrder.billing_address.city).toBe(address.city);
            expect(updateOrder.billing_address.province).toBe(address.province);
            expect(updateOrder.billing_address.zip_code).toBe(address.zip_code);
            expect(updateOrder.billing_address.address).toBe(address.address);
            expect(updateOrder.shipping_address.country).toBe(address.country);
            expect(updateOrder.shipping_address.city).toBe(address.city);
            expect(updateOrder.shipping_address.province).toBe(address.province);
            expect(updateOrder.shipping_address.zip_code).toBe(address.zip_code);
            expect(updateOrder.shipping_address.address).toBe(address.address);
        });

        it("Should return error if status is invalid", async () => {
            let order: IOrder = await createOrder("00000", mongoose.Types.ObjectId().toHexString(), address, address, OrderStatus.PENDING, mongoose.Types.ObjectId().toHexString(), mongoose.Types.ObjectId().toHexString(), [{ product: product1._id, quantity: 0 }], price, null).save();
            
            try {
                await OrderDAL.update(order, { status: "INVALID" });
                fail();
            }
            catch (error) {
                expect(error).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "status",
                    })
                ]));
            }
        });

        it("Should update order", async () => {
            let order: IOrder = await createOrder("00000", mongoose.Types.ObjectId().toHexString(), address, address, OrderStatus.PENDING, mongoose.Types.ObjectId().toHexString(), mongoose.Types.ObjectId().toHexString(), [{ product: product1._id, quantity: 0 }], price, null).save();
            
            let updateOrder: IOrder = await OrderDAL.update(order, { status: OrderStatus.COMPLETED });
            expect(updateOrder).not.toBeNull();
            expect(updateOrder.number).toBe("00000");
            expect(updateOrder.status).toBe(OrderStatus.COMPLETED);
            expect(updateOrder.billing_address.country).toBe(address.country);
            expect(updateOrder.billing_address.city).toBe(address.city);
            expect(updateOrder.billing_address.province).toBe(address.province);
            expect(updateOrder.billing_address.zip_code).toBe(address.zip_code);
            expect(updateOrder.billing_address.address).toBe(address.address);
            expect(updateOrder.shipping_address.country).toBe(address.country);
            expect(updateOrder.shipping_address.city).toBe(address.city);
            expect(updateOrder.shipping_address.province).toBe(address.province);
            expect(updateOrder.shipping_address.zip_code).toBe(address.zip_code);
            expect(updateOrder.shipping_address.address).toBe(address.address);
        });
    });

    describe("deleteHard", () => {
        it("Should return 0 deletedCount if order doesn't exist", async () => {
            let result: any = await OrderDAL.deleteHard({ _id: mongoose.Types.ObjectId().toHexString() });
            expect(result.deletedCount).toBe(0);
        });

        it("Should delete order if it exists", async () => {
            let order: IOrder = await createOrder("00000", mongoose.Types.ObjectId().toHexString(), address, address, OrderStatus.PENDING, mongoose.Types.ObjectId().toHexString(), mongoose.Types.ObjectId().toHexString(), [{ product: product1._id, quantity: 0 }], price, null).save();

            let result: any = await OrderDAL.deleteHard({ _id: order._id.toHexString() });
            expect(result.deletedCount).toBe(1);
        });
    });

    describe("deleteSoft", () => {
        it("Should return null if null order is passed", async () => {
            let order: IOrder = await OrderDAL.deleteSoft(null);
            expect(order).toBeNull();
        });

        it("Should soft delete order if it exists", async () => {
            let order: IOrder = await createOrder("00000", mongoose.Types.ObjectId().toHexString(), address, address, OrderStatus.PENDING, mongoose.Types.ObjectId().toHexString(), mongoose.Types.ObjectId().toHexString(), [{ product: product1._id, quantity: 0 }], price, null).save();

            let deletedOrder: IOrder = await OrderDAL.deleteSoft(order);
            expect(deletedOrder).not.toBeNull();
            expect(deletedOrder.deleted_at).toBeTruthy();
        });
    });

    afterEach(async () => {
        await Order.deleteMany({ number: "00000" });
    });

    afterAll(async () => {
        await Product.deleteMany({"name": "test-product-1"});
        await Product.deleteMany({"name": "test-product-1"});

        await mongoose.connection.close();
    });

});