import { apiSlice } from './apiSlice'

export const journeyApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getJourneys: builder.query({
      query: () => '/journeys',
      providesTags: (result) =>
        result
          ? [
              ...result.map((j) => ({ type: 'Journey', id: j._id })),
              { type: 'Journey', id: 'LIST' },
            ]
          : [{ type: 'Journey', id: 'LIST' }],
    }),
    getJourneyById: builder.query({
      query: (id) => `/journeys/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'Journey', id }],
    }),
    createJourney: builder.mutation({
      query: (body) => ({ url: '/journeys', method: 'POST', body }),
      invalidatesTags: [{ type: 'Journey', id: 'LIST' }, 'Dashboard'],
    }),
    updateJourney: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/journeys/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: 'Journey', id },
        { type: 'Journey', id: 'LIST' },
        'Dashboard',
      ],
    }),
    deleteJourney: builder.mutation({
      query: (id) => ({ url: `/journeys/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'Journey', id: 'LIST' }, 'Dashboard'],
    }),
  }),
})

export const {
  useGetJourneysQuery,
  useGetJourneyByIdQuery,
  useCreateJourneyMutation,
  useUpdateJourneyMutation,
  useDeleteJourneyMutation,
} = journeyApi
