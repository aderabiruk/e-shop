import async from 'async';
import { Request, Response } from 'express';
import ImageResizer from '../../utilities/image/ImageResizer';

/**
 * Resize Images
 * 
 * @param {Request} request
 * @param {Response} response 
 * @param {Function} next 
 */
export const resize = (request: Request, response: Response, next: Function) => {
    async.eachSeries(request.files, (image: any, callback: Function) => {
        ImageResizer(image)
            .then(() => {
                callback();
            })
            .catch((error) => {
                callback(error);
            })
    }, (error) => {
        if (error) {
            next(error);
        }
        else {
            next();
        }
    });
};
