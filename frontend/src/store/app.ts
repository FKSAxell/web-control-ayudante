import * as Redux from '@reduxjs/toolkit'

export interface AppState {
    isLoading: boolean
}

export interface AppCaseReducers extends Redux.SliceCaseReducers<AppState> {
    setLoading(state: AppState, action: Redux.PayloadAction<LoadingPayload>): void
}

export interface LoadingPayload {
    isLoading: boolean
}

const initialState: AppState = {
    isLoading: false
}

const slice = Redux.createSlice<AppState, AppCaseReducers>({
    name: 'app-slice',
    initialState,
    reducers: {
        setLoading: (
            state: AppState,
            action: Redux.PayloadAction<LoadingPayload>
        ) => {
            state.isLoading = action.payload.isLoading
        }
    }
})

export default slice
