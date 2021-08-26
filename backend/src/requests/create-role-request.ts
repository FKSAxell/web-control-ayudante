import * as ExpressValidator from 'express-validator'

export const CreateRoleRequestValidator: any[] = [
    ExpressValidator.body('codigo')
        .notEmpty()
        .withMessage('codigo must not be empty'),
    ExpressValidator.body('nombre')
        .notEmpty()
        .withMessage('nombre must not be empty'),
]

export default interface CreateRoleRequest {
    codigo: string
    nombre: string
}
