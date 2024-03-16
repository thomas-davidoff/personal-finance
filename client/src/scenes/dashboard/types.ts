import {
  AggregateByCategoryItem,
  AggregateByTransactionTypeItem,
} from "@/state/types"

export interface BreakdownProps {
  aggregateByTransactionCategory: AggregateByCategoryItem[]
  aggregateByTransactionType: AggregateByTransactionTypeItem[]
}
