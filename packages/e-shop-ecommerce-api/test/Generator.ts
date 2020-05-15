import Tag from "../src/models/Tag";
import City from "../src/models/City";
import Store from "../src/models/Store";
import Country from '../src/models/Country';
import Product from "../src/models/Product";
import Payment from "../src/models/Payment";
import Shipment from "../src/models/Shipment";
import Category from "../src/models/Category";
import Customer from "../src/models/Customer";
import { IAddress } from "../src/models/Location";
import { IOrderPrice } from "../src/models/Price";
import Order, { IOrderItem } from "../src/models/Order";
import PaymentMethod from "../src/models/PaymentMethod";
import ShipmentMethod from "../src/models/ShipmentMethod";

export const createCategory = (name: string, slug: string, parent: string, image_url: string, description: string) => {
    let category = new Category();
    category.name = name;
    category.slug = slug;
    category.parent = parent;
    category.image_url = image_url;
    category.description = description;
    return category;
};

export const createCity = (name: string, code: string, country_id: string, latitude: number, longitude: number) => {
    let city = new City();
    city.name = name;
    city.code = code;
    city.country_id = country_id;
    city.location = {
        type: "Point",
        coordinates: [ longitude, latitude ]
    };
    return city;
};

export const createCountry = (name: string, code: string, flag: string, currency_name: string, currency_code: string) => {
    let country = new Country();
    country.name = name;
    country.code = code;
    country.flag = flag;
    country.currency_name = currency_name;
    country.currency_code = currency_code;
    return country;
};

export const createCustomer = (first_name: string, last_name: string, email: string, phone_number: string, gender: string, store_id: string, birth_day: Date) => {
    let customer = new Customer();
    customer.first_name = first_name;
    customer.last_name = last_name;
    customer.email = email;
    customer.phone_number = phone_number;
    customer.gender = gender;
    customer.store_id = store_id;
    customer.birth_day = birth_day;
    return customer;
};

export const createOrder = (number: string, customer_id: string, billing_address: IAddress, shipping_address: IAddress, status: string, payment_method_id: string, shipping_method_id: string, items: IOrderItem[], price: IOrderPrice, note: string) => {
    let order = new Order();
    order.number = number;
    order.customer_id = customer_id;
    order.billing_address = billing_address;
    order.shipping_address = shipping_address;
    order.status = status;
    order.payment_method_id = payment_method_id;
    order.shipping_method_id = shipping_method_id;
    order.items = items;
    order.price = price;
    order.note = note;
    return order;
};

export const createPayment = (order: string, customer: string, method: string, status: string, price: number) => {
    let payment = new Payment();
    payment.order = order;
    payment.customer = customer;
    payment.method = method;
    payment.status = status
    payment.price = price;
    return payment;
};

export const createPaymentMethod = (name: string) => {
    let paymentMethod = new PaymentMethod();
    paymentMethod.name = name;
    return paymentMethod;
};

export const createShipment = (order: string, method: string, status: string, tracking_code: string) => {
    let shipment = new Shipment();
    shipment.order = order;
    shipment.method = method;
    shipment.status = status
    shipment.tracking_code = tracking_code;
    return shipment;
};

export const createShipmentMethod = (name: string) => {
    let shipmentMethod = new ShipmentMethod();
    shipmentMethod.name = name;
    return shipmentMethod;
};

export const createProduct = (name: string, slug: string, price: number, quantity: number, description: string, image_urls: string[], category_id: string, store_id: string, tags: string[], weight: number, width: number, length: number, height: number, is_visible: boolean, is_out_of_stock: boolean) => {
    let product = new Product();
    product.name = name;
    product.slug = slug;
    product.price = price;
    product.quantity = quantity;
    product.description = description;
    product.image_urls = image_urls;
    product.category_id = category_id;
    product.store_id = store_id;
    product.tags = tags;
    product.weight = weight;
    product.dimension = {
        width: width,
        length: length,
        height: height
    };
    product.is_visible = is_visible;
    product.is_out_of_stock = is_out_of_stock;
    return product;    
}

export const createStore = (name: string, email: string, phone_number: string, city_id: string, address: string, latitude: number, longitude: number) => {
    let store = new Store();
    store.name = name;
    store.email = email;
    store.phone_number = phone_number;
    store.city_id = city_id;
    store.address = address;
    store.location = {
        type: "Point",
        coordinates: [ longitude, latitude ]
    };
    return store;
};

export const createTag = (name: string, slug: string, description: string) => {
    let tag = new Tag();
    tag.name = name;
    tag.slug = slug;
    tag.description = description;
    return tag;
};