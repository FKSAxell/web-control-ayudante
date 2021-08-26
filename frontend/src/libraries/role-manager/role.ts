import { RolResponse, UsersResponse } from '../backend'
import Assistant from './assistant'
import Teacher from './teacher'
import Other from './other'

export enum Action {
    Attendances = 'Attendances',
    Asistantships = 'Asistantships',
    Careers = 'Careers',
    Classes = 'Classes',
    Faculties = 'Faculties',
    Favorites = 'Favorites',
    Subjects = 'Subjects',
    Registers = 'Registers',
    Roles = 'Roles',
    Sessions = 'Sessions',
    Locations = 'Locations',
    Users = 'Users',
}

export interface RoleValidation {
    canCreate(action: Action): boolean
    canRead(action: Action): boolean
    canReadAll(action: Action): boolean
    canUpdate(action: Action): boolean
    canDelete(action: Action): boolean
}

export default abstract class Role {
    static fromUser(user?: UsersResponse): RoleValidation[] {
        if (user === undefined) return []

        return user.rol.map((role: RolResponse) => {
            switch (role.codigo) {
            case 'PRF':
                return new Teacher()
            case 'AYU':
                return new Assistant()
            default:
                return new Other()
            }
        })
    }
}
