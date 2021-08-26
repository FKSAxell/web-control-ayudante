import { NextFunction, Request, RequestHandler, Response } from 'express'
import * as ExpressValidator from 'express-validator'

export interface AsyncCallback {
    (request: Request, response: Response, next: NextFunction): Promise<void>
}

export default class AsyncTools {
    static runAsyncWrapper(callback: AsyncCallback): RequestHandler {
        return (request: Request, response: Response, next: NextFunction) => {
            const errors: ExpressValidator.Result<ExpressValidator.ValidationError> =
                ExpressValidator.validationResult(request)
            if (!errors.isEmpty()) {
                response.status(400).json({ errors: errors.array() })
            } else {
                callback(request, response, next).catch(next)
            }
        }
    }
}
