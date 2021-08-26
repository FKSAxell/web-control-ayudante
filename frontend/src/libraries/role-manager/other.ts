import { Action, RoleValidation } from './role'

export default class Assistant implements RoleValidation {
    // eslint-disable-next-line
    canCreate(action: Action): boolean {
        return false
    }
    // eslint-disable-next-line
    canRead(action: Action): boolean {
        return false
    }
    // eslint-disable-next-line
    canReadAll(action: Action): boolean {
        return false
    }
    // eslint-disable-next-line
    canUpdate(action: Action): boolean {
        return false
    }
    // eslint-disable-next-line
    canDelete(action: Action): boolean {
        return false
    }
}
