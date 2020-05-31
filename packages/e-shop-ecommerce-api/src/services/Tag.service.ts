import voca from 'voca';
import async from 'async';
import mongoose from 'mongoose';

import Tag, { ITag } from '../models/Tag';
import TagDAL from '../dals/Tag.dal';
import Messages from '../errors/Messages';
import { NotFoundError, BadRequestError, InternalServerError } from '../errors/Errors';
import { IPaginationResponse, PaginationAdapter } from '../utilities/adapters/Pagination';


class TagService {

    /**
     * Filter Tags
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
                    TagDAL.count(query)
                        .then((count) => {
                            done(null, count);
                        })
                        .catch((error) => {
                            done(new InternalServerError(error));
                        });
                },
                (count: number, done: Function) => {
                    TagDAL.findMany(query, page, limit)
                        .then((tags: ITag[]) => {
                            resolve(PaginationAdapter(tags, page, limit, count));
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
     * Create Tag
     * 
     * @param {string} name
     * @param {string} description
     * 
     * @returns {Promise<ITag>}
     */
    static create(name: string, description: string): Promise<ITag> {
        return new Promise((resolve, reject) => {
            async.waterfall([
                (done: Function) => {
                    let slug = voca.slugify(name);
                    TagDAL.create(name, slug, description)
                        .then((tag: ITag) => {
                            resolve(tag);
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
     * Find All Tags
     * 
     * @param {string} terms
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
            
            TagService.filter(query, page, limit)
                .then((result: IPaginationResponse) => {
                    resolve(result);
                })
                .catch((error) => {
                    reject(error);
                });

        });
    }

    /**
     * Find Tag By ID
     * 
     * @param {string} id
     * 
     * @returns {Promise<ITag[]>}
     */
    static findByID(id: string): Promise<ITag> {
        return new Promise((resolve, reject) => {
            if (!mongoose.isValidObjectId(id)) {
                resolve(null);
            }
            else {
                TagDAL.findOne({ _id: id })
                    .then((tag) => {
                        resolve(tag);
                    })
                    .catch((error) => {
                        reject(new InternalServerError(error));
                    });
            }
        });
    }

    /**
     * Update Tag By ID
     * 
     * @param {string}  id 
     * @param {any}     payload 
     * 
     * @returns {Promise<ITag>}
     */
    static update(id: string, payload: any = {}): Promise<ITag> {
        return new Promise((resolve, reject) => {
            async.waterfall([
                (done: Function) => {
                    TagService.findByID(id)
                        .then((tag: ITag) => {
                            if (tag) {
                                done(null, tag);
                            }
                            else {
                                done(new NotFoundError(Messages.TAG_NOT_FOUND));
                            }
                        })
                        .catch((error: any) => {
                            done(new InternalServerError(error));
                        });
                },
                (tag: ITag, done: Function) => {
                    if (payload && payload.name) {
                        payload = {
                            ...payload,
                            slug: voca.slugify(payload.name)
                        };
                    }
                    
                    TagDAL.update(tag, payload)
                        .then((updatedTag: ITag) => {
                            resolve(updatedTag);
                        })
                        .catch((error: any) => {
                            done(new BadRequestError(error));
                        })
                }
            ], (error: any) => {
                if (error) {
                    reject(error);
                }
            });
        });
    }
};

export default TagService;