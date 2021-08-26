import * as ExpressValidator from 'express-validator'

export const CreateSubjectRequestValidator: any[] = [
    ExpressValidator.body('codigo')
        .notEmpty()
        .withMessage('codigo must not be empty'),
    ExpressValidator.body('nombre')
        .notEmpty()
        .withMessage('nombre must not be empty'),
    ExpressValidator.body('facultad')
        .notEmpty()
        .withMessage('facultad must not be empty'),
]

export default interface CreateSubjectRequest {
    codigo: string
    nombre: string
    facultad: string
}
