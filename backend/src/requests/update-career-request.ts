import * as ExpressValidator from 'express-validator'

export const UpdateCareerRequestValidator: any[] = [
    ExpressValidator.body('nombre')
        .notEmpty()
        .withMessage('nombre must not be empty'),
    ExpressValidator.body('facultad')
        .notEmpty()
        .withMessage('facultad must not be empty'),
]

export default interface UpdateCareerRequest {
    nombre: string
    facultad: string
}
