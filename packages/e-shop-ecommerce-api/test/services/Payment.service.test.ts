import moment from 'moment';
import mongoose from 'mongoose';

import Messages from '../../src/errors/Messages';
import { IAddress } from '../../src/models/Location';
import { IOrderPrice } from '../../src/models/Price';
import Order, { IOrder } from '../../src/models/Order';
import Payment, { IPayment } from '../../src/models/Payment';
import PaymentService from '../../src/services/Payment.service';
import { Gender, OrderStatus, PaymentStatus } from '../../src/utilities/constants/General';
import Customer, { ICustomer } from '../../src/models/Customer';
import PaymentMethod, { IPaymentMethod } from '../../src/models/PaymentMethod';
import { IPaginationResponse } from '../../src/utilities/adapters/Pagination';
import { createOrder, createCustomer, createPaymentMethod, createPayment } from '../Generator';

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

describe("Payment.service", () => {
    let order: IOrder;
    let customer: ICustomer;
    let paymentMethod: IPaymentMethod;

    beforeAll(async () => {
        paymentMethod = await createPaymentMethod("test-payment-method").save();
        customer = await createCustomer("test-first-name", "test-last-name", "test-email", "test-phone-number", Gender.MALE, mongoose.Types.ObjectId().toHexString(), moment().toDate()).save();
        order = await createOrder("00000", mongoose.Types.ObjectId().toHexString(), address, address, OrderStatus.PENDING, mongoose.Types.ObjectId().toHexString(), mongoose.Types.ObjectId().toHexString(), [{ product: mongoose.Types.ObjectId().toHexString(), quantity: 5 }], price, null).save();
    });

    describe("create", () => {
        it("Should return error if required fields are not provided!", async () => {
            try {
                await PaymentService.create(null, null, null, null, null);
                fail();
            }
            catch (error) {
                expect(error.statusCode).toBe(400);
                expect(error.payload.errors).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "order",
                        message: Messages.PAYMENT_ORDER_REQUIRED
                    })
                ]));
                expect(error.payload.errors).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "customer",
                        message: Messages.PAYMENT_CUSTOMER_REQUIRED
                    })
                ]));
                expect(error.payload.errors).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "status",
                        message: Messages.PAYMENT_STATUS_REQUIRED
                    })
                ]));
                expect(error.payload.errors).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "price",
                        message: Messages.PAYMENT_PRICE_REQUIRED
                    })
                ]));
            }
        });

        it("Should return error if order doesn't exist!", async () => {
            try {
                await PaymentService.create(mongoose.Types.ObjectId().toHexString(), customer._id.toString(), paymentMethod._id.toString(), PaymentStatus.PENDING, 100)
                fail();
            }
            catch (error) {
                expect(error.statusCode).toBe(400);
                expect(error.payload.errors).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "order",
                        message: Messages.ORDER_NOT_FOUND
                    })
                ]));
            }
        });

        it("Should return error if customer doesn't exist!", async () => {
            try {
                await PaymentService.create(order._id.toString(), mongoose.Types.ObjectId().toHexString(), paymentMethod._id.toString(), PaymentStatus.PENDING, 100)
                fail();
            }
            catch (error) {
                expect(error.statusCode).toBe(400);
                expect(error.payload.errors).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "customer",
                        message: Messages.CUSTOMER_NOT_FOUND
                    })
                ]));
            }
        });

        it("Should return error if payment method doesn't exist!", async () => {
            try {
                await PaymentService.create(order._id.toString(), customer._id.toString(), mongoose.Types.ObjectId().toHexString(), PaymentStatus.PENDING, 100)
                fail();
            }
            catch (error) {
                expect(error.statusCode).toBe(400);
                expect(error.payload.errors).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "method",
                        message: Messages.PAYMENT_METHOD_NOT_FOUND
                    })
                ]));
            }
        });

        it("Should create payment!", async () => {
            let payment: IPayment = await PaymentService.create(order._id.toString(), customer._id.toString(), paymentMethod._id.toString(), PaymentStatus.PENDING, 100)
            expect(payment.order.toString()).toBe(order._id.toString());
            expect(payment.customer.toString()).toBe(customer._id.toString());
            expect(payment.method.toString()).toBe(paymentMethod._id.toString());
            expect(payment.status).toBe(PaymentStatus.PENDING);
            expect(payment.price).toBe(100);
        });
    });

    describe("findAll", () => {
        it("Should return payments", async () => {
            await createPayment(order._id.toString(), customer._id.toString(), paymentMethod._id.toString(), PaymentStatus.PENDING, 100).save();

            let response: IPaginationResponse = await PaymentService.findAll();
            expect(response.data.length).toBeGreaterThan(0);
            expect(response.metadata.pagination.page).toBe(1);
            expect(response.metadata.pagination.limit).toBe(25);
        });
    });

    describe("findByID", () => {
        it("Should return null if id is invalid", async () => {
            let payment: IPayment = await PaymentService.findByID("INVALID-ID");
            expect(payment).toBeNull();
        });

        it("Should return null if payment doesn't exist", async () => {
            let payment: IPayment = await PaymentService.findByID(mongoose.Types.ObjectId().toHexString());
            expect(payment).toBeNull();
        });

        it("Should return payment", async () => {
            let payment: IPayment = await createPayment(order._id.toString(), customer._id.toString(), paymentMethod._id.toString(), PaymentStatus.PENDING, 100).save();

            let fetchedPayment: IPayment = await PaymentService.findByID(payment._id );
            expect(fetchedPayment).not.toBeNull();
            expect(fetchedPayment.order.toString()).toBe(order._id.toString());
            expect(fetchedPayment.customer.toString()).toBe(customer._id.toString());
            expect(fetchedPayment.method.toString()).toBe(paymentMethod._id.toString());
            expect(fetchedPayment.status).toBe(PaymentStatus.PENDING);
            expect(fetchedPayment.price).toBe(100);
        });
    });

    describe("update", () => {
        it("Should return error if payment doesn't exist!", async () => {
            try {
                let payment: IPayment = await PaymentService.update("INVALID-ID", {});
                fail();
            }
            catch (error) {
                expect(error.statusCode).toBe(404);
                expect(error.payload.errors).toEqual(expect.arrayContaining([
                    Messages.PAYMENT_NOT_FOUND
                ]));
            }
        });

        it("Should return error if order doesn't exist!", async () => {
            let payment: IPayment = await createPayment(order._id.toString(), customer._id.toString(), paymentMethod._id.toString(), PaymentStatus.PENDING, 100).save();

            try {
                await PaymentService.update(payment._id, { order: mongoose.Types.ObjectId().toHexString() });
                fail();
            }
            catch (error) {
                expect(error.statusCode).toBe(400);
                expect(error.payload.errors).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "order",
                        message: Messages.ORDER_NOT_FOUND
                    })
                ]));
            }
        });

        it("Should return error if customer doesn't exist!", async () => {
            let payment: IPayment = await createPayment(order._id.toString(), customer._id.toString(), paymentMethod._id.toString(), PaymentStatus.PENDING, 100).save();

            try {
                await PaymentService.update(payment._id, { customer: mongoose.Types.ObjectId().toHexString() });
                fail();
            }
            catch (error) {
                expect(error.statusCode).toBe(400);
                expect(error.payload.errors).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "customer",
                        message: Messages.CUSTOMER_NOT_FOUND
                    })
                ]));
            }
        });

        it("Should return error if method doesn't exist!", async () => {
            let payment: IPayment = await createPayment(order._id.toString(), customer._id.toString(), paymentMethod._id.toString(), PaymentStatus.PENDING, 100).save();

            try {
                await PaymentService.update(payment._id, { method: mongoose.Types.ObjectId().toHexString() });
                fail();
            }
            catch (error) {
                expect(error.statusCode).toBe(400);
                expect(error.payload.errors).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "method",
                        message: Messages.PAYMENT_METHOD_NOT_FOUND
                    })
                ]));
            }
        });

        it("Should return error if price is invalid!", async () => {
            let payment: IPayment = await createPayment(order._id.toString(), customer._id.toString(), paymentMethod._id.toString(), PaymentStatus.PENDING, 100).save();

            try {
                await PaymentService.update(payment._id, { price: "INVALID-PRICE" });
                fail();
            }
            catch (error) {
                expect(error.statusCode).toBe(400);
                expect(error.payload.errors).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "price",
                    })
                ]));
            }
        });

        it("Should return error if status is valid!", async () => {
            let payment: IPayment = await createPayment(order._id.toString(), customer._id.toString(), paymentMethod._id.toString(), PaymentStatus.PENDING, 100).save();

            try {
                await PaymentService.update(payment._id, { status: "INVALID-STATUS" });
                fail();
            }
            catch (error) {
                expect(error.statusCode).toBe(400);
                expect(error.payload.errors).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "status",
                    })
                ]));
            }
        });

        it("Shouldn't update payment if payload is empty!", async () => {
            let payment: IPayment = await createPayment(order._id.toString(), customer._id.toString(), paymentMethod._id.toString(), PaymentStatus.PENDING, 100).save();

            let updatedPayment = await PaymentService.update(payment._id, { });
            expect(updatedPayment.order.toString()).toBe(order._id.toString());
            expect(updatedPayment.customer.toString()).toBe(customer._id.toString());
            expect(updatedPayment.method.toString()).toBe(paymentMethod._id.toString());
            expect(updatedPayment.status).toBe(PaymentStatus.PENDING);
            expect(updatedPayment.price).toBe(100);
        });

        it("Should update price", async () => {
            let payment: IPayment = await createPayment(order._id.toString(), customer._id.toString(), paymentMethod._id.toString(), PaymentStatus.PENDING, 100).save();

            let updatedPayment = await PaymentService.update(payment._id, { price: 200 , status: PaymentStatus.COMPLETED});
            expect(updatedPayment.order.toString()).toBe(order._id.toString());
            expect(updatedPayment.customer.toString()).toBe(customer._id.toString());
            expect(updatedPayment.method.toString()).toBe(paymentMethod._id.toString());
            expect(updatedPayment.status).toBe(PaymentStatus.COMPLETED);
            expect(updatedPayment.price).toBe(200);
        });
    });

    afterEach(async () => {
        await Payment.deleteMany({ order: order._id.toString() });
    });

    afterAll(async () => {
        await Order.deleteMany({ number: "00000" });
        await PaymentMethod.deleteMany({ name: "test-payment-method"});
        await Customer.deleteMany({ email: "test-email", phone_number: "test-phone-number" });

        await mongoose.connection.close();
    });

});