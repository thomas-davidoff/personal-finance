import React from "react"
import dayjs from "dayjs"
import GenericForm from "@/components/GenericForm"
import TransactionForm from "@/scenes/transactions/transactionForm"
import {
  useGetTransactionQuery,
  useCreateTransactionMutation,
  useUpdateTransactionMutation,
} from "@/state/api"
import { Transaction, TransactionSubmissionProps } from "@/state/types"
import useHandleRequest from "@/hooks/useHandleRequest"

const initialTransactionData: TransactionSubmissionProps = {
  description: "",
  amount: 0,
  account: { id: 0, name: "No Account" },
  date: dayjs().format("YYYY-MM-DD"),
  category: { id: 0, name: "No Category", color: "Gray" },
}

function useFetchTransaction(id: number, open: boolean) {
  return useGetTransactionQuery(id, {
    skip: !id || !open,
  })
}

function TransactionModal({
  open,
  setOpen,
  id,
}: {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  id?: number
}) {
  const [createTransaction] = useCreateTransactionMutation()
  const [updateTransaction] = useUpdateTransactionMutation()
  const { handleRequest } = useHandleRequest()

  const handleCreate = async (data: TransactionSubmissionProps) => {
    const payload = {
      description: data.description,
      amount: Number(data.amount),
      date: data.date,
      category_id: data.category.id,
      account_id: data.account.id,
    }
    await handleRequest({
      request: () => createTransaction(payload).unwrap(),
      onSuccessMessage: "Transaction Created",
    })
  }

  const handleUpdate = async (data: TransactionSubmissionProps) => {
    if (!id) {
      throw new Error("id must be supplied to update")
    }
    const payload = {
      transactionId: id,
      transactionData: {
        description: data.description,
        amount: Number(data.amount),
        date: data.date,
        category_id: data.category.id,
        account_id: data.account.id,
      },
    }
    await handleRequest({
      request: () => updateTransaction(payload).unwrap(),
      onSuccessMessage: "Transaction Updated",
    })
  }

  return (
    <GenericForm<
      TransactionSubmissionProps,
      ReturnType<typeof useGetTransactionQuery>,
      Transaction
    >
      open={open}
      setOpen={setOpen}
      id={id}
      initialFormData={initialTransactionData}
      useFetchDataHook={useFetchTransaction}
      handleCreate={handleCreate}
      handleUpdate={handleUpdate}
      formId="transaction-form"
      label={id ? "Update Transaction" : "Create Transaction"}
      title={id ? "Update a transaction" : "Create a transaction"}
      FormComponent={TransactionForm}
    />
  )
}

export default TransactionModal
