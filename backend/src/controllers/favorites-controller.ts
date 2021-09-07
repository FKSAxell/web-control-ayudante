import Mongoose from 'mongoose'
import FavoriteRepository, {
    FavoriteInterface,
} from '../database/models/favorite'
import AttendanceRepository, {
    AttendanceInterface,
} from '../database/models/attendance'
import ClassRepository, {
    ClassesInterface,
} from '../database/models/classes'
import CreateFavoriteRequest from '../requests/create-favorite-request'
import UpdateFavoriteRequest from '../requests/update-favorite-request'

export default class FacultiesController {
    async list(classId: string|null): Promise<FavoriteInterface[]> {
        const favorites: FavoriteInterface[] = await FavoriteRepository.find({ estado: 'A' })
            .populate({
                path: 'sesion',
                populate: {
                    path: 'ayudantia',
                    populate: {
                        path: 'materia',
                    }
                }
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
        if(classId === null) {
            return favorites
        }

        const favoritesWithAssistance: any[] = []
        for(const favorite of favorites) {
            const attendanceInterface: AttendanceInterface[] = await AttendanceRepository.find({
                estado: 'A',
                clase: new Mongoose.mongo.ObjectId(classId),
                usuario: favorite.usuario._id
            })
            const favoriteWithAssistance: any = {
                usuario: favorite.usuario,
                sesion: favorite.sesion,
                estado: favorite.estado,
                attendances: attendanceInterface === null ? [] : (attendanceInterface.length === 0 ? [] : attendanceInterface)
            }
            favoritesWithAssistance.push(favoriteWithAssistance)
        }

        return favoritesWithAssistance
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
