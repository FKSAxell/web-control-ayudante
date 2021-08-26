import * as ExpressValidator from 'express-validator'

export const CreateAttendanceRequestValidator: any[] = [
    ExpressValidator.body('usuario')
        .notEmpty()
        .withMessage('usuario must not be empty'),
    ExpressValidator.body('clase')
        .notEmpty()
        .withMessage('clase must not be empty'),
    ExpressValidator.body('calificacion')
        .notEmpty()
        .withMessage('calificacion must not be empty'),
]

export default interface CreateAttendanceRequest {
    usuario: string
    clase: string
    calificacion: string
}
