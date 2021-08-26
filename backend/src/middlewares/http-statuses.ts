import { Response, Request, NextFunction } from 'express'
import Logger from '../libraries/logger'

export default class HttpStatuses {
    static logRequest(
        request: Request,
        response: Response,
        next: NextFunction
    ): void {
        Logger.debug({
            class: HttpStatuses.name,
            method: 'logRequest',
            url: request.url,
            request: {
                method: request.method,
                headers: request.headers,
                body: request.body,
                params: request.params,
                query: request.query,
            },
        })
        next()
    }

    static catch404(request: Request, response: Response): void {
        Logger.error({
            message: 'url not found',
            url: request.path,
            method: request.method,
        })

        const message: string = `url "${request.path}" via "${request.method}" was not found on the server`
        response.status(404).json({ message })
    }

    static catch500(
        /* eslint-disable @typescript-eslint/explicit-module-boundary-types */
        /* eslint-disable @typescript-eslint/no-explicit-any */
        error: any,
        request: Request,
        response: Response,
        /* eslint-disable @typescript-eslint/no-unused-vars*/
        next: NextFunction
    ): void {
        Logger.error({
            error: { message: error.message, stack: error.stack?.split('\n') },
        })
        response.status(500).json({ message: error.message, stack: error.stack?.split('\n') })
    }
}
