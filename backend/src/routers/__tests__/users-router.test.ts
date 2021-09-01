import Axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import UserLoginResponse from '../../responses/user-login-response'

describe('users-router', () => {
    describe('/api/users/login', () => {
        test.concurrent('login must fail', async () => {
            const email: string = 'anyone@mail.com'
            const password: string = '270793'
            const axiosRequestConfig: AxiosRequestConfig = {
                method: 'post',
                url: 'http://127.0.0.1:3000/api/users/login',
                data: {
                    email,
                    password,
                },
            }
            try {
                const axiosResponse: AxiosResponse<UserLoginResponse> =
                    await Axios(axiosRequestConfig)
                throw new Error(
                    `error must be received not ${JSON.stringify(
                        axiosResponse.data,
                        null,
                        4
                    )}`
                )
            } catch (error) {
                const axiosError: AxiosError = error as AxiosError
                if (axiosError.response?.data) {
                    expect(axiosError.response.data.message).toBe(
                        'internal server error'
                    )
                    return
                }
                throw error
            }
        })
        test.concurrent('login must work', async () => {
            const email: string = 'cclozano@mail.com'
            const password: string = '270793'
            const axiosRequestConfig: AxiosRequestConfig = {
                method: 'post',
                url: 'http://127.0.0.1:3000/api/users/login',
                data: {
                    email,
                    password,
                },
            }
            const axiosResponse: AxiosResponse<UserLoginResponse> = await Axios(
                axiosRequestConfig
            )
            console.log(axiosResponse.data.token)
            expect(axiosResponse.data.token).not.toBeNull()
        })
    })
})
