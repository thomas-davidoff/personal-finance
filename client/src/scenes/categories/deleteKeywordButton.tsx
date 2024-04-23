import React from "react"
import { useDeleteKeywordMutation } from "@/state/api"

import { GridRowId } from "@mui/x-data-grid"
import { Button } from "@mui/material"

interface Props {
  keywordId: GridRowId[]
}

function DeleteKeywordButton({ keywordId }: Props) {
  const [deleteTransaction, { isLoading }] = useDeleteKeywordMutation()

  const handleDeleteMultiple = async () => {
    try {
      const response = await deleteTransaction(Number(keywordId[0])).unwrap()
      alert(response.message)
    } catch (error: unknown) {
      if (typeof error === "string") {
        error.toUpperCase()
      } else if (error instanceof Error || error instanceof Object) {
        if ("message" in error) {
          alert(`Keyword could not be deleted: ${error.message}`)
        }
      } else {
        alert("There was a problem deleting the keyword.")
        console.error(error)
      }
    }
  }

  return (
    <Button
      onClick={handleDeleteMultiple}
      disabled={isLoading || keywordId.length !== 1}
    >
      Delete Selected Transaction
    </Button>
  )
}

export default DeleteKeywordButton
