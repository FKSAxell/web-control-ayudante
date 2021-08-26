import * as ExpressValidator from 'express-validator'

export const CreateClassRequestValidator: any[] = [
    ExpressValidator.body('tema')
        .notEmpty()
        .withMessage('tema must not be empty'),
    ExpressValidator.body('descripcion')
        .notEmpty()
        .withMessage('descripcion must not be empty'),
    ExpressValidator.body('enlace')
        .notEmpty()
        .withMessage('enlace must not be empty'),
    ExpressValidator.body('fechaClaseInicio')
        .notEmpty()
        .withMessage('fechaClaseInicio must not be empty'),
    ExpressValidator.body('fechaClaseFin')
        .notEmpty()
        .withMessage('fechaClaseFin must not be empty'),
    ExpressValidator.body('location')
        .notEmpty()
        .withMessage('location must not be empty'),
    ExpressValidator.body('session')
        .notEmpty()
        .withMessage('session must not be empty'),
]

export default interface CreateClassRequest {
    tema: string
    descripcion: string
    enlace: string
    fechaClaseInicio: Date
    fechaClaseFin: Date
    location: string
    session: string
}
