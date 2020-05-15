import mongoose from "mongoose";

import { createPayment } from "../Generator";
import PaymentDAL from "../../src/dals/Payment.dal";
import Payment, { IPayment } from "../../src/models/Payment";
import { PaymentStatus, OrderStatus } from "../../src/utilities/constants/General";


const app = require("../../src/app");

const OrderID = mongoose.Types.ObjectId().toHexString();
const CustomerID = mongoose.Types.ObjectId().toHexString();
const PaymentMethodID = mongoose.Types.ObjectId().toHexString();

describe("Payment.dal", () => {
    describe("create", () => {
        it("Should return error if required fields are not provided!", async () => {
            try {
                await PaymentDAL.create(null, null, null, null, null);
                fail();
            }
            catch (error) {
                expect(error).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "order",
                    })
                ]));
                expect(error).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "customer",
                    })
                ]));
                expect(error).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "status",
                    })
                ]));
                expect(error).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        field: "status",
                    })
                ]));
            }
        });

        it("Should return error if status is invalid!", async () => {
            try {
                await PaymentDAL.create(mongoose.Types.ObjectId().toHexString(), mongoose.Types.ObjectId().toHexString(), mongoose.Types.ObjectId().toHexString(), "INVALID", 100);
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

        it("Should create payment!", async () => {
            let payment = await PaymentDAL.create(OrderID, CustomerID, PaymentMethodID, PaymentStatus.PENDING, 100);
            expect(payment.order.toString()).toBe(OrderID.toString());
            expect(payment.customer.toString()).toBe(CustomerID.toString());
            expect(payment.method.toString()).toBe(PaymentMethodID.toString());
            expect(payment.status).toBe(OrderStatus.PENDING);
            expect(payment.price).toBe(100);
        });
    });

    describe("findMany", () => {
        it("Should return payments", async () => {
            await createPayment(OrderID, CustomerID, PaymentMethodID, PaymentStatus.PENDING, 100).save();

            let payment: IPayment[] = await PaymentDAL.findMany({});
            expect(payment.length).toBeGreaterThan(0);
        });
    });

    describe("findOne", () => {
        it("Should return null if payment doesn't exist", async () => {
            let fetchedPayment: IPayment = await PaymentDAL.findOne({ _id: mongoose.Types.ObjectId() });
            expect(fetchedPayment).toBeNull();
        });

        it("Should return payment", async () => {
            let payment: IPayment = await createPayment(OrderID, CustomerID, PaymentMethodID, PaymentStatus.PENDING, 100).save();

            let fetchedPayment: IPayment = await PaymentDAL.findOne({ _id: payment._id.toString() });
            expect(fetchedPayment).not.toBeNull();
            expect(fetchedPayment.order.toString()).toBe(OrderID.toString());
            expect(fetchedPayment.customer.toString()).toBe(CustomerID.toString());
            expect(fetchedPayment.method.toString()).toBe(PaymentMethodID.toString());
            expect(fetchedPayment.status).toBe(OrderStatus.PENDING);
            expect(fetchedPayment.price).toBe(100);
        });
    });

    describe("update", () => {
        it("Should return null if payment doesn't exist", async () => {
            let payment: IPayment = await PaymentDAL.update(null, {});
            expect(payment).toBeNull();
        });

        it("Shouldn't update if payload is empty", async () => {
            let payment: IPayment = await createPayment(OrderID, CustomerID, PaymentMethodID, PaymentStatus.PENDING, 100).save();

            let updatedPayment: IPayment = await PaymentDAL.update(payment, {});
            expect(updatedPayment).not.toBeNull();
            expect(updatedPayment.order.toString()).toBe(OrderID.toString());
            expect(updatedPayment.customer.toString()).toBe(CustomerID.toString());
            expect(updatedPayment.method.toString()).toBe(PaymentMethodID.toString());
            expect(updatedPayment.status).toBe(OrderStatus.PENDING);
            expect(updatedPayment.price).toBe(100);
        });

        it("Shouldn't return error if payload is invalid", async () => {
            let payment: IPayment = await createPayment(OrderID, CustomerID, PaymentMethodID, PaymentStatus.PENDING, 100).save();
            
            try {
                let updatedPayment: IPayment = await PaymentDAL.update(payment, { status: "INVALID" });
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

        it("Shouldn update payment", async () => {
            let payment: IPayment = await createPayment(OrderID, CustomerID, PaymentMethodID, PaymentStatus.PENDING, 100).save();

            let updatedPayment: IPayment = await PaymentDAL.update(payment, { price: 200 });
            expect(updatedPayment).not.toBeNull();
            expect(updatedPayment.order.toString()).toBe(OrderID.toString());
            expect(updatedPayment.customer.toString()).toBe(CustomerID.toString());
            expect(updatedPayment.method.toString()).toBe(PaymentMethodID.toString());
            expect(updatedPayment.status).toBe(OrderStatus.PENDING);
            expect(updatedPayment.price).toBe(200);
        });

    
    });

    describe("deleteHard", () => {
        it("Should return 0 deletedCount if payment doesn't exist", async () => {
            let result: any = await PaymentDAL.deleteHard({ _id: mongoose.Types.ObjectId().toString() });
            expect(result.deletedCount).toBe(0);
        });

        it("Should delete payment if it exists", async () => {
            let payment: IPayment = await createPayment(OrderID, CustomerID, PaymentMethodID, PaymentStatus.PENDING, 100).save();

            let result: any = await PaymentDAL.deleteHard({ _id: payment._id.toString() });
            expect(result.deletedCount).toBe(1);
        });
    });

    describe("deleteSoft", () => {
        it("Should return null if null payment is passed", async () => {
            let payment: IPayment = await PaymentDAL.deleteSoft(null);
            expect(payment).toBeNull();
        });

        it("Should soft delete payment if it exists", async () => {
            let payment: IPayment = await createPayment(OrderID, CustomerID, PaymentMethodID, PaymentStatus.PENDING, 100).save();

            let deletedPayment: IPayment = await PaymentDAL.deleteSoft(payment);
            expect(deletedPayment.deleted_at).toBeTruthy();
        });
    });

    afterEach(async () => {
        await Payment.deleteMany({ order: OrderID.toString() });
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

});