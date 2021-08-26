import Mongoose from 'mongoose'
import { SubjectsInterface } from './subject'
import { UserInterface } from './user'

export interface AssistantshipInterface extends Mongoose.Document {
    usuario: Mongoose.PopulatedDoc<UserInterface & Mongoose.Document>
    materia: Mongoose.PopulatedDoc<SubjectsInterface & Mongoose.Document>
    fechaInicio: Date
    fechaFin: Date
    estado: string
}

const AssistantshipsSchema: Mongoose.Schema<AssistantshipInterface> =
    new Mongoose.Schema<AssistantshipInterface>(
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
            fechaInicio: { type: Date, require: true },
            fechaFin: { type: Date, require: true },
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

export default Mongoose.model<AssistantshipInterface>(
    'Ayudantia',
    AssistantshipsSchema
)
