import { apiSlice } from './apiSlice'

function listTag(journeyId, itemId) {
  return { type: 'Submission', id: `LIST-${journeyId}-${itemId}` }
}

export const submissionApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSubmissions: builder.query({
      query: ({ journeyId, itemId }) =>
        `/journeys/${journeyId}/items/${itemId}/submissions`,
      providesTags: (result, _e, { journeyId, itemId }) =>
        result
          ? [
              ...result.map((s) => ({
                type: 'Submission',
                id: `${journeyId}-${itemId}-${s._id}`,
              })),
              listTag(journeyId, itemId),
            ]
          : [listTag(journeyId, itemId)],
    }),
    createSubmission: builder.mutation({
      query: ({ journeyId, itemId, ...body }) => ({
        url: `/journeys/${journeyId}/items/${itemId}/submissions`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_r, _e, { journeyId, itemId }) => [
        listTag(journeyId, itemId),
        { type: 'Item', id: `${journeyId}-${itemId}` },
        'Dashboard',
      ],
    }),
    updateSubmission: builder.mutation({
      query: ({ journeyId, itemId, submissionId, ...body }) => ({
        url: `/journeys/${journeyId}/items/${itemId}/submissions/${submissionId}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_r, _e, { journeyId, itemId }) => [
        listTag(journeyId, itemId),
        'Dashboard',
      ],
    }),
    deleteSubmission: builder.mutation({
      query: ({ journeyId, itemId, submissionId }) => ({
        url: `/journeys/${journeyId}/items/${itemId}/submissions/${submissionId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_r, _e, { journeyId, itemId }) => [
        listTag(journeyId, itemId),
        { type: 'Item', id: `${journeyId}-${itemId}` },
        'Dashboard',
      ],
    }),
  }),
})

export const {
  useGetSubmissionsQuery,
  useCreateSubmissionMutation,
  useUpdateSubmissionMutation,
  useDeleteSubmissionMutation,
} = submissionApi
