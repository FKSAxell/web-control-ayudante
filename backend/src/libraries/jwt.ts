import Jwt from 'jsonwebtoken'
import Env from './env'

export default class JWT {
    static async verify(token: string = ''): Promise<string | null> {
        try {
            const jwtPayload: any = Jwt.verify(token, Env.APP_JWT_KEY)
            return jwtPayload.uid
        } catch (error) {
            return null
        }
    }

    static async generate(uid: string): Promise<string> {
        return new Promise((resolve, reject) => {
            Jwt.sign(
                { uid },
                Env.APP_JWT_KEY,
                {
                    expiresIn: '365 days',
                },
                (err: any, token: string | undefined) => {
                    if (err) {
                        reject('can not generate a JWT')
                    } else {
                        if (token === undefined) {
                            reject('token is undefined')
                        } else {
                            resolve(token)
                        }
                    }
                }
            )
        })
    }
}
