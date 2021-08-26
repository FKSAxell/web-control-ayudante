import * as ExpressValidator from 'express-validator'

export const CreateFavoriteRequestValidator: any[] = [
    ExpressValidator.body('usuario')
        .notEmpty()
        .withMessage('usuario must not be empty'),
    ExpressValidator.body('sesion')
        .notEmpty()
        .withMessage('sesion must not be empty'),
]

export default interface CreateFavoriteRequest {
    usuario: string
    sesion: string
}
