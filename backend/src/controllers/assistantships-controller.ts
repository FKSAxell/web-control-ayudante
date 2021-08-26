import Mongoose from 'mongoose'
import AssistantshipsRepository, {
    AssistantshipInterface,
} from '../database/models/assistantship'
import CreateAssistantshipRequest from '../requests/create-assistantship-request'
import UpdateAssistantshipRequest from '../requests/update-assistantship-request'

export default class AssistantshipsController {
    async list(): Promise<AssistantshipInterface[]> {
        return await AssistantshipsRepository.find({ estado: 'A' })
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

    async create(request: CreateAssistantshipRequest): Promise<void> {
        await AssistantshipsRepository.create({
            ...request,
            estado: 'A',
            usuario: new Mongoose.mongo.ObjectId(request.usuario),
            materia: new Mongoose.mongo.ObjectId(request.materia),
        })
    }

    async delete(id: string): Promise<void> {
        const assistantInterface: AssistantshipInterface | null =
            await AssistantshipsRepository.findById(id)
        if (assistantInterface !== null) {
            assistantInterface.estado = 'I'
            await assistantInterface.save()
        }
    }

    async update(
        id: string,
        request: UpdateAssistantshipRequest
    ): Promise<void> {
        const assistantInterface: AssistantshipInterface | null =
            await AssistantshipsRepository.findById(id)
        if (assistantInterface === null) {
            throw new Error('class to update not found')
        }

        assistantInterface.fechaFin = request.fechaFin
        assistantInterface.fechaInicio = request.fechaInicio
        assistantInterface.usuario = new Mongoose.mongo.ObjectId(
            request.usuario
        )
        assistantInterface.materia = new Mongoose.mongo.ObjectId(
            request.materia
        )
        await assistantInterface.save()
    }
}
