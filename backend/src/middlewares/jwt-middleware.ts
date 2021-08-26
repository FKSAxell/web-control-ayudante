import { Response, Request, NextFunction } from 'express'
import JWT from '../libraries/jwt'

export default class JwtMiddleware {
    static validate(
        request: Request,
        response: Response,
        next: NextFunction
    ): void {
        const token: string | undefined = request.header('x-token')

        if (!token) {
            response.status(401).json({
                ok: false,
                msg: 'missing auth token',
            })
            return
        }

        JWT.verify(token)
        next()
    }
}
