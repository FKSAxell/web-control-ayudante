import RoleRepository, { RoleInterface } from '../database/models/role'
import CreateRoleRequest from '../requests/create-role-request'
import UpdateRoleRequest from '../requests/update-role-request'

export default class RolesController {
    async list(): Promise<RoleInterface[]> {
        return await RoleRepository.find({ estado: 'A' })
    }

    async create(request: CreateRoleRequest): Promise<void> {
        await RoleRepository.create({
            ...request,
            estado: 'A',
        })
    }

    async update(id: string, request: UpdateRoleRequest): Promise<void> {
        const roleInterface: RoleInterface | null =
            await RoleRepository.findById(id)
        if (roleInterface === null) {
            throw new Error('class to update not found')
        }

        roleInterface.codigo = request.codigo
        roleInterface.nombre = request.nombre
        await roleInterface.save()
    }

    async delete(id: string): Promise<void> {
        const roleInterface: RoleInterface | null =
            await RoleRepository.findById(id)
        if (roleInterface !== null) {
            roleInterface.estado = 'I'
            await roleInterface.save()
        }
    }
}
