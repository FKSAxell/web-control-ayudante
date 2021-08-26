import { UserInterface } from '../database/models/user'

export default interface UserLoginResponse {
    token: string
    user: UserInterface
}
