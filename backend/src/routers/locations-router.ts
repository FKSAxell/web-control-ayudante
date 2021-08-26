import { Router, Request, Response } from 'express'
import LocationsController from '../controllers/locations-controller'
import AsyncTools from '../middlewares/async-tools'
import JwtMiddleware from '../middlewares/jwt-middleware'
import { CreateLocationRequestValidator } from '../requests/create-location-request'
import { UpdateLocationRequestValidator } from '../requests/update-location-request'

const router: Router = Router()
const controller: LocationsController = new LocationsController()

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
    [JwtMiddleware.validate, ...CreateLocationRequestValidator],
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
    [JwtMiddleware.validate, ...UpdateLocationRequestValidator],
    AsyncTools.runAsyncWrapper(
        async (request: Request, response: Response): Promise<void> => {
            response.json(
                await controller.update(request.params.id, request.body)
            )
        }
    )
)

export default router
