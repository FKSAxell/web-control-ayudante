import Mongoose from 'mongoose'

export interface RoleInterface extends Mongoose.Document {
    nombre: string
    codigo: string
    estado: string
}

export const RoleSchema: Mongoose.Schema<RoleInterface> =
    new Mongoose.Schema<RoleInterface>(
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

export default Mongoose.model<RoleInterface>('Rol', RoleSchema)
