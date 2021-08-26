import Mongoose from 'mongoose'

export interface FacultyInterface extends Mongoose.Document {
    nombre: string
    codigo: string
    estado: string
}

const FacultySchema: Mongoose.Schema<FacultyInterface> =
    new Mongoose.Schema<FacultyInterface>(
        {
            nombre: {
                type: String,
                require: true,
            },
            codigo: {
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

export default Mongoose.model<FacultyInterface>('Facultad', FacultySchema)
