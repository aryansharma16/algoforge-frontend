import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from '../api/apiSlice'
import '../api/authApi'
import '../api/dashboardApi'
import '../api/journeyApi'
import '../api/itemApi'
import '../api/submissionApi'
import authSlice from './authSlice'

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
})
