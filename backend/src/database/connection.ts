import Mongoose, { ConnectOptions } from 'mongoose'
import Env from '../libraries/env'
import Logger from '../libraries/logger'

export default class MongoConnection {
    private connectOptions: ConnectOptions = {
        auth: {
            user: Env.MONGO_USERNAME,
            password: Env.MONGO_PASSWORD,
        },
        dbName: Env.MONGO_DATABASE,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    }

    private url: string = `${Env.MONGO_PROTOCOL}://${Env.MONGO_HOSTNAME}:${Env.MONGO_PORT}/admin?${Env.MONGO_ARGUMENTS}`

    async connext(): Promise<Mongoose.Mongoose> {
        Logger.debug({
            class: MongoConnection.name,
            method: 'connect',
            connectOptions: this.connectOptions,
            ur: this.url,
        })
        return await Mongoose.connect(this.url, this.connectOptions)
    }
}
