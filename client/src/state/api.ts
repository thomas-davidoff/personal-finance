import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import {
  GetKpisResponse,
  GetProductsResponse,
  getMonthlyExpensesResponse,
  GetMonthlyTransactionsResponse,
  GetAllCategoriesResponse,
  BulkUpdatePayload,
  GetMonthlyKPIsResponse,
} from '@/state/types'

export const api = createApi({
  baseQuery: fetchBaseQuery({baseUrl: '/api/'}),
  reducerPath: 'main',
  tagTypes: [
    'Kpis',
    'Products',
    'Transactions',
    'MonthlyExpenses',
    'AllCategories',
    'MonthlyKPIs',
  ],
  endpoints: build => ({
    getKpis: build.query<Array<GetKpisResponse>, void>({
      query: () => 'kpi/kpis/',
      providesTags: ['Kpis'],
    }),
    getProducts: build.query<Array<GetProductsResponse>, void>({
      query: () => 'product/products/',
      providesTags: ['Products'],
    }),
    getMonthlyExpenses: build.query<Array<getMonthlyExpensesResponse>, void>({
      query: () => 'monthly_expenses/',
      providesTags: ['MonthlyExpenses'],
    }),
    getMonthlyTransactions: build.query<
      Array<GetMonthlyTransactionsResponse>,
      {month: string; year: string; category: string; transactionType: string}
    >({
      query: args =>
        `transactions/?month=${args.month}&year=${args.year}&category=${args.category}&transaction_type=${args.transactionType}`,
      providesTags: ['Transactions'],
    }),
    getMonthlyKPIs: build.query<
      GetMonthlyKPIsResponse,
      {month: string; year: string}
    >({
      query: args =>
        `monthly_kpis/?month=${args.month}&year=${args.year}`,
      providesTags: ['MonthlyKPIs'],
    }),
    getCategories: build.query<Array<GetAllCategoriesResponse>, void>({
      query: () => 'categories/',
      providesTags: ['AllCategories'],
    }),
    bulkUpdateTransactions: build.mutation<void, BulkUpdatePayload>({
      query: bulkUpdateData => ({
        url: 'transactions/bulk_update',
        method: 'PATCH',
        body: bulkUpdateData,
      }),
      invalidatesTags: ['Transactions'],
    }),
  }),
})

export const {
  useGetKpisQuery,
  useGetProductsQuery,
  useGetMonthlyExpensesQuery,
  useGetMonthlyTransactionsQuery,
  useGetCategoriesQuery,
  useBulkUpdateTransactionsMutation,
  useGetMonthlyKPIsQuery,
} = api
