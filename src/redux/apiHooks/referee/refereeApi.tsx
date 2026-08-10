import baseApi from "@/redux/api/baseApi";

export interface Referee {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRefereeRequest {
  name: string;
  email: string;
  phoneNumber: string;
}

export interface UpdateRefereeRequest {
  name: string;
  phoneNumber: string;
}

export interface RefereeLogsParams {
  page?: number;
  limit?: number;
}

export interface PaginatedRefereeResponse {
  data: Referee[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
export const refereeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Paginated list — used by the RefereePage table with "See More"
    getReferees: builder.query<PaginatedRefereeResponse, RefereeLogsParams>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        queryParams.append("page", String(params?.page ?? 1));
        queryParams.append("limit", String(params?.limit ?? 10));
        return {
          url: `/referees?${queryParams.toString()}`,
          method: "GET",
        };
      },
      transformResponse: (response: {
        data?: Referee[];
        meta?: PaginatedRefereeResponse["meta"];
      }) => ({
        data: response.data ?? [],
        meta: response.meta ?? { page: 1, limit: 10, total: 0, totalPages: 0 },
      }),
      // Cache pages separately by (page, limit) — keeps "page 1", "page 2" etc.
      // as distinct cache entries so we can merge them below.
      serializeQueryArgs: ({ endpointName }) => endpointName,
      merge: (currentCache, newResponse, { arg }) => {
        if ((arg?.page ?? 1) === 1) {
          // fresh load / refetch of page 1 replaces everything
          return newResponse;
        }
        // "See More" — append new page's referees, dedupe by id
        const existingIds = new Set(currentCache.data.map((r) => r.id));
        const merged = [
          ...currentCache.data,
          ...newResponse.data.filter((r) => !existingIds.has(r.id)),
        ];
        return { data: merged, meta: newResponse.meta };
      },
      forceRefetch: ({ currentArg, previousArg }) =>
        currentArg?.page !== previousArg?.page,
      providesTags: ["Referees"],
    }),

    // Unpaginated — used by dropdowns (e.g. BracketsSchedule's "Assign Referee")
    // that need the FULL referee list, not just one page.
    getAllReferees: builder.query<Referee[], void>({
      query: () => ({
        url: `/referees?page=1&limit=1000`,
        method: "GET",
      }),
      transformResponse: (response: { data?: Referee[] }) =>
        response.data ?? [],
      providesTags: ["Referees"],
    }),

    // Create referee
    createReferee: builder.mutation<Referee, CreateRefereeRequest>({
      query: (body) => ({
        url: "/referees",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Referees"],
    }),

    // Update referee
    updateReferee: builder.mutation<
      Referee,
      { id: string; body: UpdateRefereeRequest }
    >({
      query: ({ id, body }) => ({
        url: `/referees/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Referees"],
    }),

    // Delete referee
    deleteReferee: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/referees/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Referees"],
    }),
  }),
});

export const {
  useGetAllRefereesQuery,
  useGetRefereesQuery,
  useCreateRefereeMutation,
  useUpdateRefereeMutation,
  useDeleteRefereeMutation,
} = refereeApi;
