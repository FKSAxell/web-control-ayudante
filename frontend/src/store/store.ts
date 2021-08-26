import { configureStore } from '@reduxjs/toolkit'
import auth from './auth'
import app from './app'

const store = configureStore({
    reducer: {
        auth: auth.reducer,
        app: app.reducer
    },
})

export default store
export type RootState = ReturnType<typeof store.getState>
