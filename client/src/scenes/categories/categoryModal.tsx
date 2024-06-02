import React from "react"
import GenericForm from "@/components/GenericForm"
import CategoryForm from "@/scenes/categories/categoryForm"
import {
  useGetCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
} from "@/state/api"
import { CategorySubmissionProps } from "@/state/types"
import useHandleRequest from "@/hooks/useHandleRequest"
import { CategoryReponse } from "@/state/types"

const initialCategoryData: CategorySubmissionProps = {
  name: "",
  description: "",
  transactionType: "",
  color: "Gray",
  transactionSubtype: "",
}

const mapCategoryResponseToSubmission = (
  data: CategoryReponse
): CategorySubmissionProps => {
  return {
    name: data.name,
    description: data.description,
    transactionType: data.transaction_type,
    color: data.color,
    transactionSubtype: data.transaction_subtype,
  }
}

function useFetchTransaction(id: number, open: boolean) {
  return useGetCategoryQuery(id, {
    skip: !id || !open,
  })
}

function CategoryModal({
  open,
  setOpen,
  id,
}: {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  id?: number
}) {
  const [createCategory] = useCreateCategoryMutation()
  const [updateCategory] = useUpdateCategoryMutation()
  const { handleRequest } = useHandleRequest()

  const handleCreate = async ({
    name,
    description,
    transactionType,
    transactionSubtype,
    color,
  }: CategorySubmissionProps) => {
    const payload = {
      name,
      description,
      transaction_type: transactionType,
      transaction_subtype: transactionSubtype,
      color,
    }
    await handleRequest({
      request: () => createCategory(payload).unwrap(),
      onSuccessMessage: "Category Created",
    })
  }

  const handleUpdate = async ({
    name,
    description,
    transactionType,
    transactionSubtype,
    color,
  }: CategorySubmissionProps) => {
    if (!id) {
      throw new Error("id must be supplied to update")
    }
    const payload = {
      id,
      data: {
        name,
        description,
        transaction_type: transactionType,
        transaction_subtype: transactionSubtype,
        color,
      },
    }
    await handleRequest({
      request: () => updateCategory(payload).unwrap(),
      onSuccessMessage: "Transaction Updated",
    })
  }

  return (
    <GenericForm<
      CategorySubmissionProps,
      ReturnType<typeof useGetCategoryQuery>,
      CategoryReponse
    >
      open={open}
      setOpen={setOpen}
      id={id}
      initialFormData={initialCategoryData}
      useFetchDataHook={useFetchTransaction}
      handleCreate={handleCreate}
      handleUpdate={handleUpdate}
      formId="transaction-form"
      label={id ? "Update Transaction" : "Create Transaction"}
      title={id ? "Update a transaction" : "Create a transaction"}
      FormComponent={CategoryForm}
      mapDataToFormData={mapCategoryResponseToSubmission}
    />
  )
}

export default CategoryModal
