import { Router, Request, Response } from 'express'
import DashboardsController from '../controllers/dashboards-controller'
import AsyncTools from '../middlewares/async-tools'
import JwtMiddleware from '../middlewares/jwt-middleware'

const router: Router = Router()
const controller: DashboardsController = new DashboardsController()

router.post(
    '/main',
    [JwtMiddleware.validate],
    AsyncTools.runAsyncWrapper(
        async (request: Request, response: Response): Promise<void> => {
            response.json(await controller.main(request.body))
        }
    )
)

export default router
