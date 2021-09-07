import { Action, RoleValidation } from './role'

export default class Admin implements RoleValidation {
    canCreate(action: Action): boolean {
        return [
            Action.Attendances,
            Action.Careers,
            Action.Faculties,
            Action.Subjects,
            Action.Roles,
            Action.Locations,
            Action.Users,
        ].includes(action)
    }
    canRead(action: Action): boolean {
        return [
            Action.Attendances,
            Action.Asistantships,
            Action.Careers,
            Action.Classes,
            Action.Faculties,
            Action.Favorites,
            Action.Subjects,
            Action.Registers,
            Action.Roles,
            Action.Sessions,
            Action.Locations,
            Action.Users,
        ].includes(action)
    }
    canReadAll(action: Action): boolean {
        return [
            Action.Attendances,
            Action.Asistantships
        ].includes(action)
    }
    canUpdate(action: Action): boolean {
        return [
            Action.Careers,
            Action.Faculties,
            Action.Subjects,
            Action.Roles,
            Action.Locations,
            Action.Users,
        ].includes(action)
    }
    canDelete(action: Action): boolean {
        return [
            Action.Careers,
            Action.Faculties,
            Action.Subjects,
            Action.Roles,
            Action.Locations,
            Action.Users,
        ].includes(action)
    }
}
