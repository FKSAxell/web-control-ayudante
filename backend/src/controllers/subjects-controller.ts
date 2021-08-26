import Mongoose from 'mongoose'
import SubjectsRepository, {
    SubjectsInterface,
} from '../database/models/subject'
import CreateSubjectRequest from '../requests/create-subject-request'

export default class SubjectsController {
    async list(): Promise<SubjectsInterface[]> {
        return await SubjectsRepository.find({ estado: 'A' }).populate({
            path: 'facultad',
            /*match: {
                estado: 'A',
            },*/
        })
    }

    async create(request: CreateSubjectRequest): Promise<void> {
        await SubjectsRepository.create({
            ...request,
            estado: 'A',
            facultad: new Mongoose.mongo.ObjectId(request.facultad),
        })
    }

    async delete(id: string): Promise<void> {
        const subjectInterface: SubjectsInterface | null =
            await SubjectsRepository.findById(id)
        if (subjectInterface !== null) {
            subjectInterface.estado = 'I'
            await subjectInterface.save()
        }
    }

    async update(id: string, request: CreateSubjectRequest): Promise<void> {
        const subjectsInterface: SubjectsInterface | null =
            await SubjectsRepository.findById(id)
        if (subjectsInterface === null) {
            throw new Error('class to update not found')
        }

        subjectsInterface.codigo = request.codigo
        subjectsInterface.nombre = request.nombre
        subjectsInterface.facultad = new Mongoose.mongo.ObjectId(
            request.facultad
        )
        await subjectsInterface.save()
    }
}
