import * as ExpressValidator from 'express-validator'

export const UpdateSessionRequestValidator: any[] = [
    ExpressValidator.body('ayudantia')
        .notEmpty()
        .withMessage('ayudantia must not be empty'),
    ExpressValidator.body('horaInicio')
        .notEmpty()
        .withMessage('horaInicio must not be empty'),
    ExpressValidator.body('minutoInicio')
        .notEmpty()
        .withMessage('minutoInicio must not be empty'),
    ExpressValidator.body('horaFin')
        .notEmpty()
        .withMessage('horaFin must not be empty'),
    ExpressValidator.body('minutoFin')
        .notEmpty()
        .withMessage('minutoFin must not be empty'),
    ExpressValidator.body('dia')
        .notEmpty()
        .withMessage('dia must not be empty'),
]

export default interface UpdateSessionRequest {
    ayudantia: string
    horaInicio: number
    minutoInicio: number
    horaFin: number
    minutoFin: number
    dia: number
}
