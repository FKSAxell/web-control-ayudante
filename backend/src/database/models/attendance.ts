import Mongoose from 'mongoose'
import { ClassesInterface } from './classes'
import { UserInterface } from './user'

export interface AttendanceInterface extends Mongoose.Document {
    usuario: Mongoose.PopulatedDoc<UserInterface & Mongoose.Document>
    clase: Mongoose.PopulatedDoc<ClassesInterface & Mongoose.Document>
    calificacion: number
    estado: string
    fechaCreacion: Date
}

const AttendancesSchema: Mongoose.Schema<AttendanceInterface> =
    new Mongoose.Schema<AttendanceInterface>(
        {
            usuario: {
                type: Mongoose.Schema.Types.ObjectId,
                ref: 'Usuario',
                require: true,
            },
            clase: {
                type: Mongoose.Schema.Types.ObjectId,
                ref: 'Clase',
                require: true,
            },
            calificacion: { type: Number, min: 1, max: 5 },
            estado: {
                type: String,
                default: 'A',
                require: true,
            },
        },
        {
            timestamps: {
                createdAt: 'fechaCreacion',
                updatedAt: 'fechaActualizacion',
            },
        }
    )

export default Mongoose.model<AttendanceInterface>(
    'Asistencia',
    AttendancesSchema
)
