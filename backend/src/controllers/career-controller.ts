import Mongoose from 'mongoose'
import CareerRepository, { CareerInterface } from '../database/models/career'
import CreateCareerRequest from '../requests/create-career-request'
import UpdateCareerRequest from '../requests/update-career-request'

export default class CareerController {
    async list(): Promise<CareerInterface[]> {
        return await CareerRepository.find({ estado: 'A' }).populate({
            path: 'facultad',
            /*match: {
                estado: 'A',
            },*/
        })
    }

    async create(request: CreateCareerRequest): Promise<void> {
        await CareerRepository.create({
            ...request,
            estado: 'A',
            facultad: new Mongoose.mongo.ObjectId(request.facultad),
        })
    }

    async delete(id: string): Promise<void> {
        const classesInterface: CareerInterface | null =
            await CareerRepository.findById(id)
        if (classesInterface !== null) {
            classesInterface.estado = 'I'
            await classesInterface.save()
        }
    }

    async update(id: string, request: UpdateCareerRequest): Promise<void> {
        const classesInterface: CareerInterface | null =
            await CareerRepository.findById(id)
        if (classesInterface === null) {
            throw new Error('class to update not found')
        }

        classesInterface.nombre = request.nombre
        classesInterface.facultad = new Mongoose.mongo.ObjectId(
            request.facultad
        )
        await classesInterface.save()
    }
}
