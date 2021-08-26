import Express from 'express'
import Cors from 'cors'
import Env from './libraries/env'
import Logger from './libraries/logger'
import DashboardsRouter from './routers/dashboards-router'
import UsersRoter from './routers/users-router'
import CareersRoter from './routers/careers-router'
import RolesRoter from './routers/roles-router'
import ClassesRouter from './routers/classes-router'
import LocationsRouter from './routers/locations-router'
import SessionsRouter from './routers/sessions-router'
import FacultiesRouter from './routers/faculties-router'
import SubjectsRouter from './routers/subjects-router'
import AttendancesRouter from './routers/attendances-router'
import AssistantshipsRouter from './routers/assistantships-router'
import RegistersRouter from './routers/registers-router'
import FavoritesRouter from './routers/favorites-router'
import HttpStatuses from './middlewares/http-statuses'
import MongoConnection from './database/connection'
import Mongoose from 'mongoose'

async function main(connection: Mongoose.Mongoose) {
    const app: Express.Application = Express()
    app.use(Express.urlencoded({ extended: false }))
    app.use(Express.json())
    app.use(Cors())
    app.use(HttpStatuses.logRequest)
    app.use('/api/dashboards', DashboardsRouter)
    app.use('/api/users', UsersRoter)
    app.use('/api/careers', CareersRoter)
    app.use('/api/roles', RolesRoter)
    app.use('/api/classes', ClassesRouter)
    app.use('/api/locations', LocationsRouter)
    app.use('/api/sessions', SessionsRouter)
    app.use('/api/faculties', FacultiesRouter)
    app.use('/api/subjects', SubjectsRouter)
    app.use('/api/attendances', AttendancesRouter)
    app.use('/api/assistantships', AssistantshipsRouter)
    app.use('/api/registers', RegistersRouter)
    app.use('/api/favorites', FavoritesRouter)

    app.use(HttpStatuses.catch404)
    app.use(HttpStatuses.catch500)

    app.listen(Env.APP_PORT, () => {
        Logger.debug({
            message: 'app listening',
            url: `http://127.0.0.1:${Env.APP_PORT}`,
        })
    })
}

const mongoConnection: MongoConnection = new MongoConnection()
mongoConnection
    .connext()
    .then((connection: Mongoose.Mongoose) => main(connection))
