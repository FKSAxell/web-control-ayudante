import * as ExpressValidator from 'express-validator'

export const CreateCareerRequestValidator: any[] = [
    ExpressValidator.body('nombre')
        .notEmpty()
        .withMessage('nombre must not be empty'),
    ExpressValidator.body('facultad')
        .notEmpty()
        .withMessage('facultad must not be empty'),
]

export default interface CreateCareerRequest {
    nombre: string
    facultad: string
}
