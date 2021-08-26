import { Router, Request, Response } from 'express'
import UsersController from '../controllers/users-controller'
import AsyncTools from '../middlewares/async-tools'
import JwtMiddleware from '../middlewares/jwt-middleware'
import { CreateUserRequestValidator } from '../requests/create-user-request'
import { UpdateUserRequestValidator } from '../requests/update-user-request'

const router: Router = Router()
const controller: UsersController = new UsersController()

router.post(
    '/login',
    [],
    AsyncTools.runAsyncWrapper(
        async (request: Request, response: Response): Promise<void> => {
            response.json(await controller.login(request.body))
        }
    )
)

router.get(
    '/',
    [JwtMiddleware.validate],
    AsyncTools.runAsyncWrapper(
        async (request: Request, response: Response): Promise<void> => {
            response.json(await controller.list())
        }
    )
)

router.post(
    '/',
    [JwtMiddleware.validate, ...CreateUserRequestValidator],
    AsyncTools.runAsyncWrapper(
        async (request: Request, response: Response): Promise<void> => {
            response.json(await controller.create(request.body))
        }
    )
)

router.patch(
    '/:id',
    [JwtMiddleware.validate, ...UpdateUserRequestValidator],
    AsyncTools.runAsyncWrapper(
        async (request: Request, response: Response): Promise<void> => {
            response.json(
                await controller.update(request.params.id, request.body)
            )
        }
    )
)

router.delete(
    '/:id',
    [JwtMiddleware.validate],
    AsyncTools.runAsyncWrapper(
        async (request: Request, response: Response): Promise<void> => {
            response.json(await controller.delete(request.params.id))
        }
    )
)

export default router
