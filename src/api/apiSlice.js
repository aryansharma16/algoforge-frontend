import {
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react'
import { logout } from '../store/authSlice'
import { API_BASE_URL } from '../utils/constants'

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token
    if (token) headers.set('Authorization', `Bearer ${token}`)
    headers.set('Content-Type', 'application/json')
    return headers
  },
})

async function baseQueryWithAuth(args, api, extraOptions) {
  const result = await baseQuery(args, api, extraOptions)
  if (result.error && result.error.status === 401) {
    api.dispatch(logout())
    if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
      window.location.assign('/login')
    }
  }
  return result
}

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Journey', 'Item', 'Submission', 'Dashboard', 'User'],
  endpoints: () => ({}),
})
