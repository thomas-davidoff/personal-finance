import {
  useDeleteCategoryMutation,
  useDeleteTransactionMutation,
} from "@/state/api"
import { GenericMutationHook } from "@/state/types"

interface Props {
  deleteMutation: GenericMutationHook<{ message: string }, number, string>
}

function useHandleDelete({ deleteMutation }: Props) {
  const [deleteMutationTrigger] = deleteMutation
  const handleDeleteCategory = async (rowId: number) => {
    try {
      const response = await deleteMutationTrigger(Number(rowId)).unwrap()
      alert(response.message)
    } catch (error: unknown) {
      if (typeof error === "string") {
        alert(error.toUpperCase())
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

  return handleDeleteCategory
}

export function useHandleDeleteCategory() {
  const deleteCategoryMutation =
    useDeleteCategoryMutation() as GenericMutationHook<
      { message: string },
      number,
      "AllCategories"
    >

  return useHandleDelete({
    deleteMutation: deleteCategoryMutation,
  })
}

export function useHandleDeleteTransaction() {
  const deleteTransactionMutation =
    useDeleteTransactionMutation() as GenericMutationHook<
      { message: string },
      number,
      "AllCategories"
    >

  return useHandleDelete({
    deleteMutation: deleteTransactionMutation,
  })
}
