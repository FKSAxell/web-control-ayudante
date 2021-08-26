import Mongoose from 'mongoose'
import RegisterRepository, {
    RegisterInterface,
} from '../database/models/register'
import CreateRegisterRequest from '../requests/create-register-request'
import UpdateRegisterRequest from '../requests/update-register-request'

export default class RegistersController {
    async list(): Promise<RegisterInterface[]> {
        return await RegisterRepository.find({ estado: 'A' })
            .populate({
                path: 'usuario',
                /*match: {
                    estado: 'A',
                },*/
            })
            .populate({
                path: 'materia',
                /*match: {
                    estado: 'A',
                },*/
            })
    }

    async create(request: CreateRegisterRequest): Promise<void> {
        await RegisterRepository.create({
            ...request,
            estado: 'A',
            usuario: new Mongoose.mongo.ObjectId(request.usuario),
            materia: new Mongoose.mongo.ObjectId(request.materia),
        })
    }

    async update(id: string, request: UpdateRegisterRequest): Promise<void> {
        const roleInterface: RegisterInterface | null =
            await RegisterRepository.findById(id)
        if (roleInterface === null) {
            throw new Error('register to update not found')
        }

        roleInterface.usuario = new Mongoose.mongo.ObjectId(request.usuario)
        roleInterface.materia = new Mongoose.mongo.ObjectId(request.materia)
        await roleInterface.save()
    }

    async delete(id: string): Promise<void> {
        const roleInterface: RegisterInterface | null =
            await RegisterRepository.findById(id)
        if (roleInterface !== null) {
            roleInterface.estado = 'I'
            await roleInterface.save()
        }
    }
}
