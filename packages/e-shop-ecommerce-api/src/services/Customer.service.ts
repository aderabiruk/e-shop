import mongoose from 'mongoose';

import CustomerDAL from '../dals/Customer.dal';
import { ICustomer } from '../models/Customer';
import { InternalServerError } from '../errors/Errors';


class CustomerService {

    /**
     * Find Customer By ID
     * 
     * @param {number} page
     * @param {number} limit
     * 
     * @returns {Promise<ICustomer[]>}
     */
    static findByID(id: string): Promise<ICustomer> {
        return new Promise((resolve, reject) => {
            if (!mongoose.isValidObjectId(id)) {
                resolve(null);
            }
            else {
                CustomerDAL.findOne({ _id: id })
                    .then((customer: ICustomer) => {
                        resolve(customer);
                    })
                    .catch((error) => {
                        reject(new InternalServerError(error));
                    });
            }
        });
    }

};

export default CustomerService;