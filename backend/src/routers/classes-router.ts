import { Router, Request, Response } from 'express'
import ClassesController from '../controllers/classes-controller'
import AsyncTools from '../middlewares/async-tools'
import JwtMiddleware from '../middlewares/jwt-middleware'
import { CreateClassRequestValidator } from '../requests/create-class-request'
import { UpdateClassRequestValidator } from '../requests/update-class-request'

const router: Router = Router()
const controller: ClassesController = new ClassesController()

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
    [JwtMiddleware.validate, ...CreateClassRequestValidator],
    AsyncTools.runAsyncWrapper(
        async (request: Request, response: Response): Promise<void> => {
            response.json(await controller.create(request.body))
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

router.patch(
    '/:id',
    [JwtMiddleware.validate, ...UpdateClassRequestValidator],
    AsyncTools.runAsyncWrapper(
        async (request: Request, response: Response): Promise<void> => {
            response.json(
                await controller.update(request.params.id, request.body)
            )
        }
    )
)

export default router
