import Mongoose from 'mongoose'
import AttendancesRepository, {
    AttendanceInterface,
} from '../database/models/attendance'
import CreateAttendanceRequest from '../requests/create-attendance-request'
import UpdateAttendanceRequest from '../requests/update-attendance-request'

export default class AttendancesController {
    async list(): Promise<AttendanceInterface[]> {
        return await AttendancesRepository.find({ estado: 'A' })
            .populate({
                path: 'usuario',
                /*match: {
                    estado: 'A',
                },*/
            })
            .populate({
                path: 'clase',
                /*match: {
                    estado: 'A',
                },*/
            })
    }

    async create(request: CreateAttendanceRequest): Promise<void> {
        await AttendancesRepository.create({
            ...request,
            estado: 'A',
            usuario: new Mongoose.mongo.ObjectId(request.usuario),
            clase: new Mongoose.mongo.ObjectId(request.clase),
        })
    }

    async delete(id: string): Promise<void> {
        const assistantInterface: AttendanceInterface | null =
            await AttendancesRepository.findById(id)
        if (assistantInterface !== null) {
            assistantInterface.estado = 'I'
            await assistantInterface.save()
        }
    }

    async update(id: string, request: UpdateAttendanceRequest): Promise<void> {
        const assistantInterface: AttendanceInterface | null =
            await AttendancesRepository.findById(id)
        if (assistantInterface === null) {
            throw new Error('class to update not found')
        }

        assistantInterface.calificacion = parseInt(request.calificacion)
        assistantInterface.usuario = new Mongoose.mongo.ObjectId(
            request.usuario
        )
        assistantInterface.clase = new Mongoose.mongo.ObjectId(request.clase)
        await assistantInterface.save()
    }
}
