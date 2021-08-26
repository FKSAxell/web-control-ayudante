import * as ExpressValidator from 'express-validator'

export const CreateFacultiesRequestValidator: any[] = [
    ExpressValidator.body('codigo')
        .notEmpty()
        .withMessage('codigo must not be empty'),
    ExpressValidator.body('nombre')
        .notEmpty()
        .withMessage('nombre must not be empty'),
]

export default interface CreateFacultiesRequest {
    codigo: string
    nombre: string
}
