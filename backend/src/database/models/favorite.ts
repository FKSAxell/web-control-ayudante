import Mongoose from 'mongoose'
import { SessionInterface } from './session'
import { UserInterface } from './user'

export interface FavoriteInterface extends Mongoose.Document {
    usuario: Mongoose.PopulatedDoc<UserInterface & Mongoose.Document>
    sesion: Mongoose.PopulatedDoc<SessionInterface & Mongoose.Document>
    estado: string
}

const FavoritesSchema: Mongoose.Schema<FavoriteInterface> =
    new Mongoose.Schema<FavoriteInterface>(
        {
            usuario: {
                type: Mongoose.Schema.Types.ObjectId,
                ref: 'Usuario',
                require: true,
            },
            sesion: {
                type: Mongoose.Schema.Types.ObjectId,
                ref: 'Sesion',
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

export default Mongoose.model<FavoriteInterface>('Favorito', FavoritesSchema)
