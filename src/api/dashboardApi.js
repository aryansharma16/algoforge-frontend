import { apiSlice } from './apiSlice'

/** Backend: GET /api/auth/dashboard (alias: GET /api/dashboard) */
export const dashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboard: builder.query({
      query: () => '/auth/dashboard',
      providesTags: ['Dashboard'],
    }),
  }),
})

export const { useGetDashboardQuery } = dashboardApi
