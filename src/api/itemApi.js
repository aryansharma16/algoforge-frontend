import { apiSlice } from './apiSlice'

export const itemApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getItems: builder.query({
      query: (journeyId) => `/journeys/${journeyId}/items`,
      providesTags: (result, _e, journeyId) =>
        result
          ? [
              ...result.map((item) => ({
                type: 'Item',
                id: `${journeyId}-${item._id}`,
              })),
              { type: 'Item', id: `LIST-${journeyId}` },
            ]
          : [{ type: 'Item', id: `LIST-${journeyId}` }],
    }),
    getItemById: builder.query({
      query: ({ journeyId, itemId }) =>
        `/journeys/${journeyId}/items/${itemId}`,
      providesTags: (_r, _e, { journeyId, itemId }) => [
        { type: 'Item', id: `${journeyId}-${itemId}` },
      ],
    }),
    createItem: builder.mutation({
      query: ({ journeyId, ...body }) => ({
        url: `/journeys/${journeyId}/items`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_r, _e, { journeyId }) => [
        { type: 'Item', id: `LIST-${journeyId}` },
        { type: 'Journey', id: journeyId },
        'Dashboard',
      ],
    }),
    updateItem: builder.mutation({
      query: ({ journeyId, itemId, ...body }) => ({
        url: `/journeys/${journeyId}/items/${itemId}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_r, _e, { journeyId, itemId }) => [
        { type: 'Item', id: `${journeyId}-${itemId}` },
        { type: 'Item', id: `LIST-${journeyId}` },
        'Dashboard',
      ],
    }),
    deleteItem: builder.mutation({
      query: ({ journeyId, itemId }) => ({
        url: `/journeys/${journeyId}/items/${itemId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_r, _e, { journeyId }) => [
        { type: 'Item', id: `LIST-${journeyId}` },
        { type: 'Journey', id: journeyId },
        'Dashboard',
      ],
    }),
  }),
})

export const {
  useGetItemsQuery,
  useGetItemByIdQuery,
  useCreateItemMutation,
  useUpdateItemMutation,
  useDeleteItemMutation,
} = itemApi
