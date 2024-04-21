import React from "react"
import { useDeleteTransactionMutation } from "@/state/api"
import { GridRowId } from "@mui/x-data-grid"
import { Button } from "@mui/material"

interface Props {
  transactionId: GridRowId[]
}

function DeleteMultipleTransactions({ transactionId }: Props) {
  const [deleteTransaction, { isLoading }] = useDeleteTransactionMutation()

  const handleDeleteMultiple = async () => {
    try {
      const response = await deleteTransaction(
        Number(transactionId[0])
      ).unwrap()
      alert(response.message)
    } catch (error) {
      alert(error.data.message)
    }
  }

  return (
    <Button
      onClick={handleDeleteMultiple}
      disabled={isLoading || transactionId.length !== 1}
    >
      Delete Selected Transaction
    </Button>
  )
}

export default DeleteMultipleTransactions
