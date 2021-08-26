import Mongoose from 'mongoose'
import SessionRepository, { SessionInterface } from '../database/models/session'
import CreateSessionRequest from '../requests/create-session-request'
import UpdateSessionRequest from '../requests/update-session-request'

export default class SessionController {
    async list(): Promise<SessionInterface[]> {
        return await SessionRepository.find({ estado: 'A' }).populate({
            path: 'ayudantia',
            /*match: {
                estado: 'A',
            },*/
        })
    }

    async create(request: CreateSessionRequest): Promise<void> {
        await SessionRepository.create({
            ...request,
            estado: 'A',
            ayudantia: new Mongoose.mongo.ObjectId(request.ayudantia),
        })
    }

    async update(id: string, request: UpdateSessionRequest): Promise<void> {
        const roleInterface: SessionInterface | null =
            await SessionRepository.findById(id)
        if (roleInterface === null) {
            throw new Error('session to update not found')
        }

        roleInterface.horaInicio = request.horaInicio
        roleInterface.minutoInicio = request.minutoInicio
        roleInterface.horaFin = request.horaFin
        roleInterface.minutoFin = request.minutoFin
        roleInterface.dia = request.dia
        roleInterface.ayudantia = new Mongoose.mongo.ObjectId(request.ayudantia)
        await roleInterface.save()
    }

    async delete(id: string): Promise<void> {
        const roleInterface: SessionInterface | null =
            await SessionRepository.findById(id)
        if (roleInterface !== null) {
            roleInterface.estado = 'I'
            await roleInterface.save()
        }
    }
}
