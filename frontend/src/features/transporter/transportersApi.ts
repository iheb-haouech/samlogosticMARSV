import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const transportersApi = createApi({
  reducerPath: 'transportersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:6001/',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('accessToken');
      if (token) headers.set('authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Transporter'],
  endpoints: (builder) => ({
    getAdminTransporters: builder.query<any[], void>({
      query: () => 'auth/admin/transporters',
      providesTags: ['Transporter'],
    }),
    createTransporter: builder.mutation<any, any>({
      query: (body) => ({
        url: 'auth/admin/create-transporter',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Transporter'],  // Refresh liste auto
    }),
  }),
});

export const { 
  useGetAdminTransportersQuery, 
  useCreateTransporterMutation 
} = transportersApi;


