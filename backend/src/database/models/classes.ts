import Mongoose from 'mongoose'
import { LocationInterface } from './location'
import { SessionInterface } from './session'

export interface ClassesInterface extends Mongoose.Document {
    sesion: Mongoose.PopulatedDoc<SessionInterface & Mongoose.Document>
    tema: string
    descripcion: string
    enlace: string
    fechaClaseInicio: Date
    fechaClaseFin: Date
    ubicacion: Mongoose.PopulatedDoc<LocationInterface & Mongoose.Document>
    estado: string
}

const ClassesSchema: Mongoose.Schema<ClassesInterface> =
    new Mongoose.Schema<ClassesInterface>(
        {
            sesion: {
                type: Mongoose.Schema.Types.ObjectId,
                ref: 'Sesion',
                require: true,
            },
            tema: {
                type: String,
                require: true,
            },
            descripcion: {
                type: String,
                require: true,
            },
            enlace: {
                type: String,
                require: true,
            },
            fechaClaseFin: { type: Date, require: true },
            fechaClaseInicio: { type: Date, require: true },
            ubicacion: {
                type: Mongoose.Schema.Types.ObjectId,
                ref: 'Ubicacion',
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

export default Mongoose.model<ClassesInterface>('Clase', ClassesSchema)
