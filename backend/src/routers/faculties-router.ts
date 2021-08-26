import { Router, Request, Response } from 'express'
import FacultiesController from '../controllers/faculties-controller'
import AsyncTools from '../middlewares/async-tools'
import JwtMiddleware from '../middlewares/jwt-middleware'
import { CreateFacultiesRequestValidator } from '../requests/create-faculties-request'
import { UpdateFacultiesRequestValidator } from '../requests/update-faculties-request'

const router: Router = Router()
const controller: FacultiesController = new FacultiesController()

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
    [JwtMiddleware.validate, ...CreateFacultiesRequestValidator],
    AsyncTools.runAsyncWrapper(
        async (request: Request, response: Response): Promise<void> => {
            response.json(await controller.create(request.body))
        }
    )
)

router.patch(
    '/:id',
    [JwtMiddleware.validate, ...UpdateFacultiesRequestValidator],
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
