import Mongoose from 'mongoose'
import { CareerInterface } from './career'
import { RoleInterface } from './role'

export interface UserInterface extends Mongoose.Document {
    carrera: Mongoose.PopulatedDoc<CareerInterface & Mongoose.Document>
    rol: Mongoose.PopulatedDoc<RoleInterface & Mongoose.Document>[]
    nombre: string
    email: string
    password: string
    tokenFCM: string
    estado: string
}

const userSchema: Mongoose.Schema<UserInterface> =
    new Mongoose.Schema<UserInterface>(
        {
            carrera: {
                type: Mongoose.Schema.Types.ObjectId,
                ref: 'Carrera',
            },
            rol: [
                {
                    type: Mongoose.Schema.Types.ObjectId,
                    ref: 'Rol',
                },
            ],
            nombre: {
                type: String,
                require: true,
            },
            email: {
                type: String,
                require: true,
                unique: true,
            },
            password: {
                type: String,
                require: true,
            },
            tokenFCM: {
                type: String,
                unique: true,
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

export default Mongoose.model<UserInterface>('Usuario', userSchema)
