import Mongoose from 'mongoose'
import { FacultyInterface } from './faculty'

export interface CareerInterface extends Mongoose.Document {
    facultad: Mongoose.PopulatedDoc<FacultyInterface & Mongoose.Document>
    nombre: string
    estado: string
}

const CareerSchema: Mongoose.Schema<CareerInterface> =
    new Mongoose.Schema<CareerInterface>(
        {
            facultad: {
                type: Mongoose.Schema.Types.ObjectId,
                ref: 'Facultad',
                require: true,
            },
            nombre: {
                type: String,
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

export default Mongoose.model<CareerInterface>('Carrera', CareerSchema)
