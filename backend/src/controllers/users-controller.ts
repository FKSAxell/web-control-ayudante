import Mongoose from 'mongoose'
import UserRepository, { UserInterface } from '../database/models/user'
import UserLoginRequest from '../requests/user-login-request'
import UserLoginResponse from '../responses/user-login-response'
import Bcrypt from 'bcryptjs'
import JWT from '../libraries/jwt'
import CreateUserRequest from '../requests/create-user-request'
import UpdateUserRequest from '../requests/update-user-request'

export default class UsersController {
    async login(
        userLoginRequest: UserLoginRequest
    ): Promise<UserLoginResponse> {
        const user: UserInterface | null = await UserRepository.findOne({
            email: userLoginRequest.email,
            estado: 'A',
        })
            .populate({
                path: 'rol',
                match: {
                    estado: 'A',
                },
            })
            .populate({
                path: 'carrera',
                match: {
                    estado: 'A',
                },
                populate: {
                    path: 'facultad',
                    match: {
                        estado: 'A',
                    },
                },
            })

        if (user === null) {
            throw new Error('user not found')
        }

        if (!Bcrypt.compareSync(userLoginRequest.password, user.password)) {
            throw new Error('password is invalid')
        }

        if (user.rol.length == 0) {
            throw new Error('do not have permissions')
        }

        if (userLoginRequest.tokenFCM) {
            if (user.tokenFCM != userLoginRequest.tokenFCM) {
                user.tokenFCM = userLoginRequest.tokenFCM
                await user.save()
            }
        }

        return {
            token: await JWT.generate(user.id),
            user
        }
    }

    async list(): Promise<UserInterface[]> {
        return await UserRepository.find({ estado: 'A' }).populate({
            path: 'rol',
            /*match: {
                estado: 'A',
            },*/
        })
        /*
        .populate({
            path: 'carrera',
            match: {
                estado: 'A',
            },
            populate: {
                path: 'facultad',
                match: {
                    estado: 'A',
                },
            },
        })*/
    }

    async create(request: CreateUserRequest): Promise<void> {
        const salt: string = Bcrypt.genSaltSync()
        await UserRepository.create({
            ...request,
            password: Bcrypt.hashSync(request.password, salt),
            estado: 'A',
            rol: request.rol.map(
                (rol: string) => new Mongoose.mongo.ObjectId(rol)
            ),
        })
    }

    async delete(id: string): Promise<void> {
        const userInterface: UserInterface | null =
            await UserRepository.findById(id)
        if (userInterface !== null) {
            userInterface.estado = 'I'
            await userInterface.save()
        }
    }

    async update(id: string, request: UpdateUserRequest): Promise<void> {
        const userInterface: UserInterface | null =
            await UserRepository.findById(id)
        if (userInterface === null) {
            throw new Error('class to update not found')
        }

        const salt: string = Bcrypt.genSaltSync()
        userInterface.nombre = request.nombre
        userInterface.email = request.email
        if (request.password !== undefined && request.password !== '') {
            userInterface.password = Bcrypt.hashSync(request.password, salt)
        }
        userInterface.rol = request.rol.map(
            (rol: string) => new Mongoose.mongo.ObjectId(rol)
        )
        await userInterface.save()
    }
}
