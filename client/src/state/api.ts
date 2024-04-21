import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import {
  Account,
  Transaction,
  CategoryReponse,
  UserTransactionPatch,
} from "@/state/types"

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "/api/" }),
  reducerPath: "main",
  tagTypes: [
    "AllAccounts",
    "AllTransactions",
    "SingleTransaction",
    "AllCategories",
  ],
  endpoints: (build) => ({
    getAccounts: build.query<Array<Account>, void>({
      query: () => "accounts/",
      providesTags: ["AllAccounts"],
    }),
    getTransactions: build.query<
      Array<Transaction>,
      { start?: string; end?: string }
    >({
      query: (args) => `transactions/?start=${args.start}&end=${args.end}`,
      providesTags: ["AllTransactions"],
    }),
    createTransaction: build.mutation<Transaction, UserTransactionPatch>({
      query: (transactionData) => ({
        url: "transactions/",
        method: "POST",
        body: transactionData,
      }),
      invalidatesTags: ["AllTransactions"],
    }),
    deleteTransaction: build.mutation<void, number>({
      query: (transactionId) => ({
        url: `transactions/${transactionId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AllTransactions"],
    }),
    getTransaction: build.query<Transaction, number>({
      query: (transactionId) => ({
        url: `transactions/${transactionId}`,
        providesTags: ["SingleTransaction"],
      }),
    }),
    updateTransaction: build.mutation<Transaction, updateTransactionProps>({
      query: ({ transactionId, transactionData }) => ({
        url: `transactions/${transactionId}`,
        method: "PATCH",
        body: transactionData,
      }),
    }),
    getCategories: build.query<Array<CategoryReponse>, void>({
      query: () => "categories/",
      providesTags: ["AllCategories"],
    }),
  }),
})

interface updateTransactionProps {
  transactionId: number
  transactionData: UserTransactionPatch
}

export const {
  useGetAccountsQuery,
  useGetTransactionsQuery,
  useCreateTransactionMutation,
  useDeleteTransactionMutation,
  useGetTransactionQuery,
  useGetCategoriesQuery,
  useUpdateTransactionMutation,
} = api
