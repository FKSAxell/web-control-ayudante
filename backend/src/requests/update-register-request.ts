import * as ExpressValidator from 'express-validator'

export const UpdateRegisterRequestValidator: any[] = [
    ExpressValidator.body('usuario')
        .notEmpty()
        .withMessage('usuario must not be empty'),
    ExpressValidator.body('materia')
        .notEmpty()
        .withMessage('materia must not be empty'),
]

export default interface UpdateRegisterRequest {
    usuario: string
    materia: string
}
