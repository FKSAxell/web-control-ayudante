import DotEnv from 'dotenv'
DotEnv.config()

export interface Env {
    APP_PORT: number
    APP_MODE: string
    APP_LOGS_EXPANDED: boolean
    APP_JWT_KEY: string

    MONGO_PROTOCOL: string
    MONGO_HOSTNAME: string
    MONGO_PORT: number
    MONGO_DATABASE: string
    MONGO_USERNAME: string
    MONGO_PASSWORD: string
    MONGO_ARGUMENTS: string
}

const env: Env = {
    APP_PORT: parseInt(process.env.APP_PORT || '3000'),
    APP_MODE: (process.env.APP_MODE || 'debug').toLowerCase(),
    APP_LOGS_EXPANDED: process.env.APP_LOGS_EXPANDED === 'true',
    APP_JWT_KEY: process.env.APP_JWT_KEY || '',

    MONGO_PROTOCOL: process.env.MONGO_PROTOCOL || '',
    MONGO_HOSTNAME: process.env.MONGO_HOSTNAME || '',
    MONGO_PORT: parseInt(process.env.MONGO_PORT || ''),
    MONGO_DATABASE: process.env.MONGO_DATABASE || '',
    MONGO_USERNAME: process.env.MONGO_USERNAME || '',
    MONGO_PASSWORD: process.env.MONGO_PASSWORD || '',
    MONGO_ARGUMENTS: process.env.MONGO_ARGUMENTS || '',
}

export default env
