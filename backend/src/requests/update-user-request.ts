import * as ExpressValidator from 'express-validator'

export const UpdateUserRequestValidator: any[] = [
    ExpressValidator.body('rol')
        .notEmpty()
        .withMessage('rol must not be empty'),
    ExpressValidator.body('nombre')
        .notEmpty()
        .withMessage('nombre must not be empty'),
    ExpressValidator.body('email')
        .notEmpty()
        .withMessage('email must not be empty'),
]

export default interface CreateUserRequest {
    rol: string[]
    nombre: string
    email: string
    password?: string
}
