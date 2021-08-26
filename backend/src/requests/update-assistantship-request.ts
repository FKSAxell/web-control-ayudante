import * as ExpressValidator from 'express-validator'

export const UpdateAssistantshipRequestValidator: any[] = [
    ExpressValidator.body('usuario')
        .notEmpty()
        .withMessage('usuario must not be empty'),
    ExpressValidator.body('materia')
        .notEmpty()
        .withMessage('materia must not be empty'),
    ExpressValidator.body('fechaInicio')
        .notEmpty()
        .withMessage('fechaInicio must not be empty'),
    ExpressValidator.body('fechaFin')
        .notEmpty()
        .withMessage('fechaFin must not be empty'),
]

export default interface UpdateAssistantshipRequest {
    usuario: string
    materia: string
    fechaInicio: Date
    fechaFin: Date
}
