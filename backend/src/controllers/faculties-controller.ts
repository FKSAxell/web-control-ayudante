import FacultiesRepository, {
    FacultyInterface,
} from '../database/models/faculty'
import CreateFacultiesRequest from '../requests/create-faculties-request'
import UpdateFacultiesRequest from '../requests/update-faculties-request'

export default class FacultiesController {
    async list(): Promise<FacultyInterface[]> {
        return await FacultiesRepository.find({ estado: 'A' })
    }

    async create(request: CreateFacultiesRequest): Promise<void> {
        await FacultiesRepository.create({
            ...request,
            estado: 'A',
        })
    }

    async delete(id: string): Promise<void> {
        const facultyInterface: FacultyInterface | null =
            await FacultiesRepository.findById(id)
        if (facultyInterface !== null) {
            facultyInterface.estado = 'I'
            await facultyInterface.save()
        }
    }

    async update(id: string, request: UpdateFacultiesRequest): Promise<void> {
        const facultyInterface: FacultyInterface | null =
            await FacultiesRepository.findById(id)
        if (facultyInterface === null) {
            throw new Error('class to update not found')
        }

        facultyInterface.codigo = request.codigo
        facultyInterface.nombre = request.nombre
        await facultyInterface.save()
    }
}
