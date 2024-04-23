import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import {
  Account,
  Transaction,
  CategoryReponse,
  UserTransactionPatch,
  Category,
  updateTransactionProps,
  getCommonDescriptionWordsProps,
  getCommonDescriptionWordsResponse,
  KeywordRequest,
  KeywordResponse,
  categorizeTransactionsResponse,
  addCategoryRequest,
  updateCategoryRequest,
} from "@/state/types"

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "/api/" }),
  reducerPath: "main",
  tagTypes: [
    "AllAccounts",
    "AllTransactions",
    "SingleTransaction",
    "AllCategories",
    "AllUncategorizedTransactions",
    "AllKeywords",
    "CommonDescriptionWords",
    "SingleCategory",
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
      invalidatesTags: ["AllTransactions", "AllUncategorizedTransactions"],
    }),
    deleteTransaction: build.mutation<void, number>({
      query: (transactionId) => ({
        url: `transactions/${transactionId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AllTransactions", "AllUncategorizedTransactions"],
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
      invalidatesTags: ["AllTransactions", "AllUncategorizedTransactions"],
    }),
    getCategories: build.query<Array<CategoryReponse>, void>({
      query: () => "categories/",
      providesTags: ["AllCategories"],
    }),
    getUncategorizedTransactions: build.query<Array<Transaction>, void>({
      query: () => "categories/1/transactions",
      providesTags: ["AllUncategorizedTransactions"],
    }),
    getCommonDescriptionWords: build.query<
      Array<getCommonDescriptionWordsResponse>,
      getCommonDescriptionWordsProps
    >({
      query: ({
        minConsecutive,
        minWordLength,
        ignoredWords,
        numberToReturn,
      }) => ({
        url: `transactions/common-uncategorized-words?min_consecutive=${minConsecutive}&min_word_length=${minWordLength}&ignore_words=${ignoredWords}&number_to_return=${numberToReturn}`,
        providesTags: ["CommonDescriptionWords"],
      }),
    }),
    getKeywords: build.query<Array<KeywordResponse>, void>({
      query: () => "keywords/",
      providesTags: ["AllKeywords"],
    }),
    createKeyword: build.mutation<KeywordResponse, KeywordRequest>({
      query: (keywordData) => ({
        url: "keywords/",
        method: "POST",
        body: keywordData,
      }),
      invalidatesTags: ["AllKeywords"],
    }),
    categorizeTransactions: build.mutation<
      categorizeTransactionsResponse,
      void
    >({
      query: () => ({
        url: "categories/categorize-transactions",
        method: "PATCH",
      }),
      invalidatesTags: [
        "AllTransactions",
        "AllUncategorizedTransactions",
        "CommonDescriptionWords",
        "AllCategories",
      ],
    }),
    deleteKeyword: build.mutation<{ message: string }, number>({
      query: (keywordId) => ({
        url: `keywords/${keywordId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AllKeywords"],
    }),
    createCategory: build.mutation<Category, addCategoryRequest>({
      query: (categoryData) => ({
        url: "categories/",
        method: "POST",
        body: categoryData,
      }),
      invalidatesTags: ["AllCategories"],
    }),
    deleteCategory: build.mutation<{ message: string }, number>({
      query: (categoryId) => ({
        url: `categories/${categoryId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AllCategories"],
    }),
    updateCategory: build.mutation<Category, updateCategoryRequest>({
      query: ({ id, data }) => ({
        url: `categories/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["AllCategories"],
    }),
    getCategory: build.query<Category, number>({
      query: (categoryId) => ({
        url: `categories/${categoryId}`,
        providesTags: ["SingleCategory"],
      }),
    }),
  }),
})

export const {
  useGetAccountsQuery,
  useGetTransactionsQuery,
  useCreateTransactionMutation,
  useDeleteTransactionMutation,
  useGetTransactionQuery,
  useGetCategoriesQuery,
  useUpdateTransactionMutation,
  useGetUncategorizedTransactionsQuery,
  useGetCommonDescriptionWordsQuery,
  useGetKeywordsQuery,
  useCreateKeywordMutation,
  useCategorizeTransactionsMutation,
  useDeleteKeywordMutation,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
  useGetCategoryQuery,
} = api
