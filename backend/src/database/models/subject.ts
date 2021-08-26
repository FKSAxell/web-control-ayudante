import Mongoose from 'mongoose'
import { FacultyInterface } from './faculty'

export interface SubjectsInterface extends Mongoose.Document {
    codigo: string
    nombre: string
    facultad: Mongoose.PopulatedDoc<FacultyInterface & Mongoose.Document>
    estado: string
}

const SubjectsSchema: Mongoose.Schema<SubjectsInterface> =
    new Mongoose.Schema<SubjectsInterface>(
        {
            nombre: {
                type: String,
                require: true,
            },
            codigo: {
                type: String,
                require: true,
            },
            facultad: {
                type: Mongoose.Schema.Types.ObjectId,
                ref: 'Facultad',
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

export default Mongoose.model<SubjectsInterface>('Materia', SubjectsSchema)
