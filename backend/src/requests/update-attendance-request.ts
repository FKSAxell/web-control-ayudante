import * as ExpressValidator from 'express-validator'

export const UpdateAttendanceRequestValidator: any[] = [
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

export default interface UpdateAttendanceRequest {
    usuario: string
    clase: string
    calificacion: string
}
