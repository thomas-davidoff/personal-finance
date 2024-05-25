import { MutationTrigger } from "@reduxjs/toolkit/dist/query/react/buildHooks"
import {
  MutationDefinition,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from "@reduxjs/toolkit/query/react"
import { useDeleteCategoryMutation } from "@/state/api"

type GenericMutationHook<
  MutationResponse,
  MutationArg,
  Tags extends string
> = Readonly<
  [
    MutationTrigger<
      MutationDefinition<
        MutationArg,
        BaseQueryFn<
          string | FetchArgs,
          unknown,
          FetchBaseQueryError,
          object,
          FetchBaseQueryMeta
        >,
        Tags,
        MutationResponse,
        "main"
      >
    >,
    {
      isLoading: boolean
      isSuccess: boolean
      isError: boolean
      error?: FetchBaseQueryError | undefined
      data?: MutationResponse
      originalArgs?: MutationArg
      fulfilledTimeStamp?: number
    }
  ]
>

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
