import { Router, Request, Response } from 'express'
import AssistantshipsController from '../controllers/assistantships-controller'
import AsyncTools from '../middlewares/async-tools'
import JwtMiddleware from '../middlewares/jwt-middleware'
import { CreateAssistantshipRequestValidator } from '../requests/create-assistantship-request'
import { UpdateAssistantshipRequestValidator } from '../requests/update-assistantship-request'

const router: Router = Router()
const controller: AssistantshipsController = new AssistantshipsController()

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
    [JwtMiddleware.validate, ...CreateAssistantshipRequestValidator],
    AsyncTools.runAsyncWrapper(
        async (request: Request, response: Response): Promise<void> => {
            response.json(await controller.create(request.body))
        }
    )
)

router.patch(
    '/:id',
    [JwtMiddleware.validate, ...UpdateAssistantshipRequestValidator],
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
