import LocationRepository, {
    LocationInterface,
} from '../database/models/location'
import CreateLocationRequest from '../requests/create-location-request'
import UpdateClassRequest from '../requests/update-class-request'
import UpdateLocationRequest from '../requests/update-location-request'

export default class LocationsController {
    async list(): Promise<LocationInterface[]> {
        return await LocationRepository.find({ estado: 'A' })
    }

    async create(request: CreateLocationRequest): Promise<void> {
        await LocationRepository.create({
            ...request,
            estado: 'A',
        })
    }

    async delete(id: string): Promise<void> {
        const locationInterface: LocationInterface | null =
            await LocationRepository.findById(id)
        if (locationInterface !== null) {
            locationInterface.estado = 'I'
            await locationInterface.save()
        }
    }

    async update(id: string, request: UpdateLocationRequest): Promise<void> {
        const locationInterface: LocationInterface | null =
            await LocationRepository.findById(id)
        if (locationInterface === null) {
            throw new Error('class to update not found')
        }

        locationInterface.codigo = request.codigo
        locationInterface.nombre = request.nombre
        await locationInterface.save()
    }
}
