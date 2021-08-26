import { Router, Request, Response } from 'express'
import RolesController from '../controllers/roles-controller'
import AsyncTools from '../middlewares/async-tools'
import JwtMiddleware from '../middlewares/jwt-middleware'
import { CreateRoleRequestValidator } from '../requests/create-role-request'
import { UpdateRoleRequestValidator } from '../requests/update-role-request'

const router: Router = Router()
const controller: RolesController = new RolesController()

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
    [JwtMiddleware.validate, ...CreateRoleRequestValidator],
    AsyncTools.runAsyncWrapper(
        async (request: Request, response: Response): Promise<void> => {
            response.json(await controller.create(request.body))
        }
    )
)

router.patch(
    '/:id',
    [JwtMiddleware.validate, ...UpdateRoleRequestValidator],
    AsyncTools.runAsyncWrapper(
        async (request: Request, response: Response): Promise<void> => {
            response.json(await controller.update(request.params.id, request.body))
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
