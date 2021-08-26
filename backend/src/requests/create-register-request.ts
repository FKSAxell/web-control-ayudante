import * as ExpressValidator from 'express-validator'

export const CreateRegisterRequestValidator: any[] = [
    ExpressValidator.body('usuario')
        .notEmpty()
        .withMessage('usuario must not be empty'),
    ExpressValidator.body('materia')
        .notEmpty()
        .withMessage('materia must not be empty'),
]

export default interface CreateRegisterRequest {
    usuario: string
    materia: string
}
