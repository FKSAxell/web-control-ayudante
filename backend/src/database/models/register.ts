import Mongoose from 'mongoose'
import { ClassesInterface } from './classes'
import { SubjectsInterface } from './subject'
import { UserInterface } from './user'

export interface RegisterInterface extends Mongoose.Document {
    usuario: Mongoose.PopulatedDoc<UserInterface & Mongoose.Document>
    materia: Mongoose.PopulatedDoc<SubjectsInterface & Mongoose.Document>
    estado: string
}

const RegistersSchema: Mongoose.Schema<RegisterInterface> =
    new Mongoose.Schema<RegisterInterface>(
        {
            usuario: {
                type: Mongoose.Schema.Types.ObjectId,
                ref: 'Usuario',
                require: true,
            },
            materia: {
                type: Mongoose.Schema.Types.ObjectId,
                ref: 'Materia',
                require: true,
            },
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

export default Mongoose.model<RegisterInterface>('Registro', RegistersSchema)
