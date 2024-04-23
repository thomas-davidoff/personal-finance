export interface ExpensesByCategory {
  salaries: number
  supplies: number
  services: number
}

export interface Month {
  id: string
  month: string
  income: number
  expenses: number
}

export interface Day {
  id: string
  date: string
  revenue: number
  expenses: number
}

export interface GetKpisResponse {
  id: string
  _id: string
  __v: number
  totalProfit: number
  totalRevenue: number
  totalExpenses: number
  expensesByCategory: ExpensesByCategory
  monthlyData: Array<Month>
  dailyData: Array<Day>
  createdAt: string
  updatedAt: string
}

export interface GetProductsResponse {
  id: string
  _id: string
  __v: number
  price: number
  expense: number
  transactions: Array<string>
  createdAt: string
  updatedAt: string
}

export interface GetTransactionsResponse {
  id: string
  _id: string
  __v: number
  buyer: string
  amount: number
  productIds: Array<string>
  createdAt: string
  updatedAt: string
}

export interface monthlySpending {
  month_year: string
  total_expenses: number
}

export interface dailySpending {
  date: string
  daily_expenses: number
  cumulative_spending: number
}

export interface cumulativeSpending {
  last_month: Array<dailySpending>
  prev_month: Array<dailySpending>
}

export interface getMonthlyExpensesResponse {
  total_over_year: number
  monthly_spending: Array<monthlySpending>
  cumulative: cumulativeSpending
  category: categorizedExpenses
}

export interface category {
  category: string
  total_expenses: number
}

export interface categorizedExpenses {
  last_month: Array<category>
  year: Array<category>
}

export interface GetMonthlyTransactionsResponse {
  id: number
  account: number
  amount: number
  category: string
  date: string
  description: string
  type: string
}

export interface GetMonthlyCumulativeSpendingResponse {
  cumulative_spending: number
  daily_spending: number
  date: string
  day: number
}

export interface GetAllCategoriesResponse {
  id: number
  description: number
  name: string
  transaction_type: number
  transaction_subtype: string
}

export interface TransactionFieldChange {
  [fieldName: string]: string
}

export interface BulkUpdatePayloadItem {
  transactionId: string
  changes: TransactionFieldChange
}

export type BulkUpdatePayload = BulkUpdatePayloadItem[]

export interface AggregateByCategoryItem {
  category: string
  total: number
  transaction_type: string
}

export interface AggregateByTransactionTypeItem {
  total: number
  transaction_type: string
}

export interface GetMonthlyKPIsResponse {
  aggregate_by_category: AggregateByCategoryItem[]
  aggregate_by_transaction_type: AggregateByTransactionTypeItem[]
  cumulative_spending: GetMonthlyCumulativeSpendingResponse[]
}

export interface Account {
  account_type?: string
  current_balance?: number
  id: number
  name?: string
  num_transactions?: number
  starting_balance?: number
}

export interface Category {
  id: number
  name?: string
  description?: string
  num_transactions?: number
  transaction_type?: string
  transaction_subtype?: string
}

export interface CategoryReponse {
  id: number
  name: string
  description: string
  num_transactions: number
  transaction_type: string
  transaction_subtype: string
}

export interface Transaction {
  account: Account
  amount: number
  category?: Category
  date: string
  description: string
  id?: number
}

export interface UserTransactionPatch {
  account_id: number
  category_id: number
  date: string
  description: string
  amount: number
}

export interface addCategoryRequest {
  name: string
  description: string
  transaction_type: string
  transaction_subtype: string
}

export interface updateCategoryRequest {
  id: number
  data: addCategoryRequest
}

export interface categorizeTransactionsResponse {
  before_uncategorized: number
  total_transactions: number
  total_updated: number
  updated: Transaction[]
  warnings: string[]
  after_uncategorized: number
}

export interface KeywordRequest {
  keyword: string
  description?: string
  category_id: number
}

export interface KeywordResponse {
  id: number
  keyword: string
  category: Category
  description: string
}

export interface updateTransactionProps {
  transactionId: number
  transactionData: UserTransactionPatch
}

export interface getCommonDescriptionWordsProps {
  minConsecutive?: number
  minWordLength?: number
  ignoredWords?: string
  numberToReturn?: number
}

export interface Description {
  account: string
  category: string
  description: string
}

export interface Combo {
  count: number
  key: Description
}

export interface getCommonDescriptionWordsResponse {
  avg_amount: number
  total_amount: number
  combos: Combo[]
  count: number
  phrase: string
}
