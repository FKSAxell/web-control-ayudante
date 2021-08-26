import Mongoose from 'mongoose'
import ClassesRepository, { ClassesInterface } from '../database/models/classes'
import CreateClassRequest from '../requests/create-class-request'

export default class ClassesController {
    async list(): Promise<ClassesInterface[]> {
        return await ClassesRepository.find({ estado: 'A' })
            .populate({
                path: 'sesion',
                /*match: {
                    estado: 'A',
                },*/
            })
            .populate({
                path: 'ubicacion',
                /*match: {
                    estado: 'A',
                },*/
            })
    }

    async create(request: CreateClassRequest): Promise<void> {
        await ClassesRepository.create({
            ...request,
            estado: 'A',
            sesion: new Mongoose.mongo.ObjectId(request.session),
            ubicacion: new Mongoose.mongo.ObjectId(request.location),
        })
    }

    async delete(id: string): Promise<void> {
        const classesInterface: ClassesInterface | null =
            await ClassesRepository.findById(id)
        if (classesInterface !== null) {
            classesInterface.estado = 'I'
            await classesInterface.save()
        }
    }

    async update(id: string, request: CreateClassRequest): Promise<void> {
        const classesInterface: ClassesInterface | null =
            await ClassesRepository.findById(id)
        if (classesInterface === null) {
            throw new Error('class to update not found')
        }

        classesInterface.enlace = request.enlace
        classesInterface.descripcion = request.descripcion
        classesInterface.fechaClaseInicio = request.fechaClaseInicio
        classesInterface.fechaClaseFin = request.fechaClaseFin
        classesInterface.tema = request.tema
        classesInterface.ubicacion = new Mongoose.mongo.ObjectId(
            request.location
        )
        classesInterface.sesion = new Mongoose.mongo.ObjectId(request.session)
        await classesInterface.save()
    }
}
