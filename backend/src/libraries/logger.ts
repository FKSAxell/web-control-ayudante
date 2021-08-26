import 'winston-daily-rotate-file'
import Winston from 'winston'
import LogForm from 'logform'
import Env from './env'

const logsPath: string = './logs'
const logsLevel: string = Env.APP_MODE
const logsExpanded: boolean = Env.APP_LOGS_EXPANDED

const format: LogForm.Format = Winston.format.combine(
    Winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    Winston.format.printf((info: LogForm.TransformableInfo) => {
        /* eslint-disable @typescript-eslint/no-explicit-any */
        const cache: any[] = []
        function jsonReplacer(key: string, value: any) {
            if (typeof value === 'object' && value !== null) {
                if (cache.includes(value)) {
                    return '...[CIRCULAR]...'
                }
                cache.push(value)
            }
            return value
        }

        return JSON.stringify(info, jsonReplacer, logsExpanded ? 4 : 0)
    })
)

const transports: Winston.transport[] = [
    new Winston.transports.Console(),
    new Winston.transports.DailyRotateFile({
        dirname: logsPath,
        filename: 'error-%DATE%.log',
        datePattern: 'YYYY-MM-DD-HH-MM',
        zippedArchive: true,
        maxSize: '200m',
        maxFiles: '7d',
        level: 'error',
    }),
    new Winston.transports.DailyRotateFile({
        dirname: logsPath,
        filename: 'all-%DATE%.log',
        datePattern: 'YYYY-MM-DD-HH-MM',
        zippedArchive: true,
        maxSize: '200m',
        maxFiles: '7d',
    }),
]

const Logger: Winston.Logger = Winston.createLogger({
    level: logsLevel,
    levels: Winston.config.npm.levels,
    transports,
    format,
})

export default Logger
