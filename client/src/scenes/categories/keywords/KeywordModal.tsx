import React from "react"
import GenericForm from "@/components/GenericForm"
import { KeywordSubmissionProps, KeywordResponse } from "@/state/types"
import useHandleRequest from "@/hooks/useHandleRequest"
import {
  useCreateKeywordMutation,
  useGetKeywordQuery,
  useUpdateKeywordMutation,
} from "@/state/api"
import KeywordForm from "./KeywordForm"

const initialKeywordData: KeywordSubmissionProps = {
  keyword: "Placeholder Keyword",
  description: "",
  categoryId: 0,
}

const mapResponseToSubmission = (
  data: KeywordResponse
): KeywordSubmissionProps => {
  return {
    keyword: data.keyword,
    description: data.description,
    categoryId: data.category.id,
  }
}

function useFetchTransaction(id: number, open: boolean) {
  return useGetKeywordQuery(id, {
    skip: !id || !open,
  })
}

function KeywordModal({
  open,
  setOpen,
  id,
  placeholder,
}: {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  id?: number
  placeholder?: string
}) {
  const [createKeyword] = useCreateKeywordMutation()
  const [updateKeyword] = useUpdateKeywordMutation()
  const { handleRequest } = useHandleRequest()

  const handleCreate = async ({
    keyword,
    description,
    categoryId,
  }: KeywordSubmissionProps) => {
    const payload = {
      keyword: keyword,
      description: description,
      category_id: categoryId,
    }
    await handleRequest({
      request: () => createKeyword(payload).unwrap(),
      onSuccessMessage: "Category Created",
    })
  }

  const handleUpdate = async ({
    keyword,
    description,
    categoryId,
  }: KeywordSubmissionProps) => {
    if (!id) {
      throw new Error("id must be supplied to update")
    }
    const payload = {
      id,
      data: {
        keyword: keyword,
        description: description,
        category_id: categoryId,
      },
    }
    await handleRequest({
      request: () => updateKeyword(payload).unwrap(),
      onSuccessMessage: "Keyword Updated",
      onErrorMessage: "It doesn't work like that you idiot.",
    })
  }

  return (
    <GenericForm<
      KeywordSubmissionProps,
      ReturnType<typeof useGetKeywordQuery>,
      KeywordResponse
    >
      open={open}
      setOpen={setOpen}
      id={id}
      initialFormData={
        placeholder
          ? { ...initialKeywordData, keyword: placeholder }
          : initialKeywordData
      }
      useFetchDataHook={useFetchTransaction}
      handleCreate={handleCreate}
      handleUpdate={handleUpdate}
      formId="transaction-form"
      label={id ? "Update Transaction" : "Create Transaction"}
      title={id ? "Update a transaction" : "Create a transaction"}
      FormComponent={KeywordForm}
      mapDataToFormData={mapResponseToSubmission}
    />
  )
}

export default KeywordModal
