import React from "react"
import { useDeleteCategoryMutation } from "@/state/api"

import { GridRowId } from "@mui/x-data-grid"
import { Button } from "@mui/material"

interface Props {
  categoryId: GridRowId[]
}

function DeleteCategoryButton({ categoryId }: Props) {
  const [deleteCategory, { isLoading }] = useDeleteCategoryMutation()

  const handleDeleteMultiple = async () => {
    try {
      const response = await deleteCategory(Number(categoryId[0])).unwrap()
      alert(response.message)
    } catch (error: unknown) {
      if (typeof error === "string") {
        error.toUpperCase()
      } else if (error instanceof Error || error instanceof Object) {
        if ("message" in error) {
          alert(`Category could not be deleted: ${error.message}`)
        }
      } else {
        alert("There was a problem deleting the category.")
        console.error(error)
      }
    }
  }

  return (
    <Button
      onClick={handleDeleteMultiple}
      disabled={isLoading || categoryId.length !== 1}
    >
      Delete Selected Category
    </Button>
  )
}

export default DeleteCategoryButton
