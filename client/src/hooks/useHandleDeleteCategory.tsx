import { useDeleteCategoryMutation } from "@/state/api"

export function useHandleDeleteCategory() {
  const [deleteCategory] = useDeleteCategoryMutation()

  const handleDeleteCategory = async (rowId: number) => {
    try {
      const response = await deleteCategory(Number(rowId)).unwrap()
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
