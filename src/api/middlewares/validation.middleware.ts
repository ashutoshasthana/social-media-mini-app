import { plainToClass,classToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import * as express from 'express';
import HttpException from '../../exceptions/HttpException';


/**
 *
 *Methode Used to Validate the Input Data
 * @template T
 * @param {*} type  // Data type of data to it Could be class or interface
 * @param {boolean} [skipMissingProperties=false] //if true then property will validation will skip which is not supplied to req body, else all will be validated.
 * @returns {express.RequestHandler} //return request handler
 */
function validationMiddleware<T>(type: any, skipMissingProperties = false): express.RequestHandler {
  return (req, res, next) => {
    validate(plainToClass(type, req.body), { skipMissingProperties })
      .then((errors: ValidationError[]) => {
        if (errors.length > 0) {
          const message = errors.map((error: ValidationError) => Object.values(error.constraints)).join(', ');
          next(new HttpException(400,false,message));
        } else {
          next();
        }
      });
  };
}
 
export default validationMiddleware;