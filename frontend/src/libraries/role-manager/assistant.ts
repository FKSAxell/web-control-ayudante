import { Action, RoleValidation } from './role'

export default class Assistant implements RoleValidation {
    canCreate(action: Action): boolean {
        return [
            //Action.Attendances,
            Action.Asistantships,
            Action.Classes,
            //Action.Favorites,
            //Action.Registers,
            Action.Sessions,
            //Action.Locations,
        ].includes(action)
    }
    canRead(action: Action): boolean {
        return [
            Action.Attendances,
            Action.Asistantships,
            //Action.Careers,
            Action.Classes,
            //Action.Faculties,
            //Action.Favorites,
            //Action.Subjects,
            //Action.Registers,
            //Action.Roles,
            Action.Sessions,
            //Action.Locations,
        ].includes(action)
    }
    // eslint-disable-next-line
    canReadAll(action: Action): boolean {
        return false
    }
    canUpdate(action: Action): boolean {
        return [
            Action.Asistantships,
            Action.Classes,
            //Action.Favorites,
            //Action.Registers,
            //Action.Sessions,
            //Action.Locations,
        ].includes(action)
    }
    canDelete(action: Action): boolean {
        return [
            Action.Asistantships,
            Action.Classes,
            //Action.Favorites,
            //Action.Registers,
            //Action.Sessions,
            //Action.Locations,
        ].includes(action)
    }
}
