import * as ExpressValidator from 'express-validator'

export const UpdateLocationRequestValidator: any[] = [
    ExpressValidator.body('codigo')
        .notEmpty()
        .withMessage('codigo must not be empty'),
    ExpressValidator.body('nombre')
        .notEmpty()
        .withMessage('nombre must not be empty'),
]

export default interface UpdateLocationRequest {
    codigo: string
    nombre: string
}
