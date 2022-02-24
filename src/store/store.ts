import { configureStore } from '@reduxjs/toolkit'
import { markersReducer } from './reducers/markersReducer'

export const store = configureStore({
  reducer: {
    markers: markersReducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware()
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export type AsyncThunkConfig = {
  state: RootState
  dispatch: AppDispatch
}
