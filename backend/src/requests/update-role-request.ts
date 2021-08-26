import * as ExpressValidator from 'express-validator'

export const UpdateRoleRequestValidator: any[] = [
    ExpressValidator.body('codigo')
        .notEmpty()
        .withMessage('codigo must not be empty'),
    ExpressValidator.body('nombre')
        .notEmpty()
        .withMessage('nombre must not be empty'),
]

export default interface UpdateRoleRequest {
    codigo: string
    nombre: string
}
