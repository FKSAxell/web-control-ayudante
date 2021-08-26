import * as Redux from '@reduxjs/toolkit'
import { UsersResponse } from '../libraries/backend'

export interface AuthState {
    token: string | undefined
    user: UsersResponse | undefined
}

export interface AuthCaseReducers extends Redux.SliceCaseReducers<AuthState> {
    login(state: AuthState, action: Redux.PayloadAction<LoginPayload>): void
    logout(state: AuthState): void
}

export interface LoginPayload {
    token: string
    user: UsersResponse
}

const token: string|null = localStorage.getItem('token')
const userJson: string|null = localStorage.getItem('user')
const user: UsersResponse|null = userJson === null ? null : JSON.parse(userJson)

const initialState: AuthState = {
    token: token === null ? undefined : token,
    user: user == null ? undefined : user
}

const credentials: string | null = localStorage.getItem('credentials')
if (credentials !== null) {
    const json: AuthState = JSON.parse(credentials)
    initialState.token = json.token
}

const slice = Redux.createSlice<AuthState, AuthCaseReducers>({
    name: 'auth-slice',
    initialState,
    reducers: {
        login: (
            state: AuthState,
            action: Redux.PayloadAction<LoginPayload>
        ) => {
            state.token = action.payload.token
            state.user = action.payload.user

            localStorage.setItem('token', state.token)
            localStorage.setItem('user', JSON.stringify(state.user))
        },
        logout: (state: AuthState) => {
            state.token = undefined
            state.user = undefined

            localStorage.removeItem('token')
            localStorage.removeItem('user')
        },
    },
})

export default slice
