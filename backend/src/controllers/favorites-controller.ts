import Mongoose from 'mongoose'
import FavoriteRepository, {
    FavoriteInterface,
} from '../database/models/favorite'
import CreateFavoriteRequest from '../requests/create-favorite-request'
import UpdateFavoriteRequest from '../requests/update-favorite-request'

export default class FacultiesController {
    async list(): Promise<FavoriteInterface[]> {
        return await FavoriteRepository.find({ estado: 'A' })
            .populate({
                path: 'sesion',
                /*match: {
                    estado: 'A',
                },*/
            })
            .populate({
                path: 'usuario',
                /*match: {
                    estado: 'A',
                },*/
            })
    }

    async create(request: CreateFavoriteRequest): Promise<void> {
        await FavoriteRepository.create({
            ...request,
            estado: 'A',
            sesion: new Mongoose.mongo.ObjectId(request.sesion),
            usuario: new Mongoose.mongo.ObjectId(request.usuario),
        })
    }

    async delete(id: string): Promise<void> {
        const facultyInterface: FavoriteInterface | null =
            await FavoriteRepository.findById(id)
        if (facultyInterface !== null) {
            facultyInterface.estado = 'I'
            await facultyInterface.save()
        }
    }

    async update(id: string, request: UpdateFavoriteRequest): Promise<void> {
        const facultyInterface: FavoriteInterface | null =
            await FavoriteRepository.findById(id)
        if (facultyInterface === null) {
            throw new Error('favorite to update not found')
        }

        facultyInterface.sesion = new Mongoose.mongo.ObjectId(request.sesion)
        facultyInterface.usuario = new Mongoose.mongo.ObjectId(request.usuario)
        await facultyInterface.save()
    }
}
