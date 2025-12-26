import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Parcel, CreateParcelRequest, TrackingInfo } from '../../types/parcel';
import type { ApiResponse, PaginatedResponse } from '../../types/api';
import type { RootState } from './store';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5002';

export const parcelApi = createApi({
  reducerPath: 'parcelApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.access_token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Parcel', 'Tracking'],
  endpoints: builder => ({
    createParcel: builder.mutation<ApiResponse<Parcel>, CreateParcelRequest>({
      query: parcelData => ({
        url: '/api/v1/parcels',
        method: 'POST',
        body: parcelData,
      }),
      invalidatesTags: ['Parcel'],
    }),
    getMyParcels: builder.query<
      ApiResponse<PaginatedResponse<Parcel>>,
      {
        page?: number;
        limit?: number;
        status?: string;
      }
    >({
      query: ({ page = 1, limit = 10, status }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        if (status) params.append('status', status);
        return `/api/v1/parcels/my-parcels?${params}`;
      },
      providesTags: ['Parcel'],
    }),
    getParcelById: builder.query<ApiResponse<Parcel>, number>({
      query: id => `/api/v1/parcels/${id}`,
      providesTags: (result, error, id) => [{ type: 'Parcel', id }],
    }),
    trackParcel: builder.query<ApiResponse<TrackingInfo>, string>({
      query: trackingCode => `/api/v1/parcels/track/${trackingCode}`,
      providesTags: (result, error, trackingCode) => [{ type: 'Tracking', id: trackingCode }],
    }),
    cancelParcel: builder.mutation<ApiResponse<Parcel>, number>({
      query: id => ({
        url: `/api/v1/parcels/${id}/cancel`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Parcel', id }, 'Parcel'],
    }),
  }),
});

export const {
  useCreateParcelMutation,
  useGetMyParcelsQuery,
  useGetParcelByIdQuery,
  useTrackParcelQuery,
  useCancelParcelMutation,
} = parcelApi;
