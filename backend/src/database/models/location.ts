import Mongoose from 'mongoose'

export interface LocationInterface extends Mongoose.Document {
    nombre: string
    codigo: string
    estado: string
}

const LocationSchema: Mongoose.Schema<LocationInterface> =
    new Mongoose.Schema<LocationInterface>(
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

export default Mongoose.model<LocationInterface>('Ubicacion', LocationSchema)
