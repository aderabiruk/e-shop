import mongoose from 'mongoose';

import OrderDAL from '../dals/Order.dal';
import { IOrder } from '../models/Order';
import { InternalServerError } from '../errors/Errors';


class OrderService {

    /**
     * Find Order By ID
     * 
     * @param {number} page
     * @param {number} limit
     * 
     * @returns {Promise<IOrder[]>}
     */
    static findByID(id: string): Promise<IOrder> {
        return new Promise((resolve, reject) => {
            if (!mongoose.isValidObjectId(id)) {
                resolve(null);
            }
            else {
                OrderDAL.findOne({ _id: id })
                    .then((order: IOrder) => {
                        resolve(order);
                    })
                    .catch((error) => {
                        reject(new InternalServerError(error));
                    });
            }
        });
    }

};

export default OrderService;