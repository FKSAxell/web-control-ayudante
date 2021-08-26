import Mongoose from 'mongoose'
import { AssistantshipInterface } from './assistantship'

export interface SessionInterface extends Mongoose.Document {
    ayudantia: Mongoose.PopulatedDoc<AssistantshipInterface & Mongoose.Document>
    horaInicio: number
    minutoInicio: number
    horaFin: number
    minutoFin: number
    dia: number
    estado: string
}

const SessionSchema: Mongoose.Schema<SessionInterface> =
    new Mongoose.Schema<SessionInterface>(
        {
            ayudantia: {
                type: Mongoose.Schema.Types.ObjectId,
                ref: 'Ayudantia',
                require: true,
            },
            horaInicio: { type: Number, min: 0, max: 24 },
            minutoInicio: { type: Number, min: 0, max: 59 },
            horaFin: { type: Number, min: 0, max: 24 },
            minutoFin: { type: Number, min: 0, max: 59 },
            dia: { type: Number, min: 1, max: 7 },
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

export default Mongoose.model<SessionInterface>('Sesion', SessionSchema)
