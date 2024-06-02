import React, { useState, useEffect } from "react"
import ModalForm from "@/components/ModalForm"
import { FormProps } from "./types"

interface GenericFormProps<Submission, Query, ResultOfQuery> {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  id?: number
  initialFormData: Submission
  useFetchDataHook: (id: number, open: boolean) => Query
  handleCreate: (data: Submission) => Promise<void>
  handleUpdate: (data: Submission) => Promise<void>
  formId: string
  label: string
  title: string
  FormComponent: React.FC<FormProps<Submission>>
  mapDataToFormData?: (data: ResultOfQuery) => Submission
}

function GenericForm<Submission, Query, ResultOfQuery>({
  open,
  setOpen,
  id,
  initialFormData,
  useFetchDataHook,
  handleCreate,
  handleUpdate,
  formId,
  label,
  title,
  FormComponent,
  mapDataToFormData,
}: GenericFormProps<Submission, Query, ResultOfQuery>) {
  const queryResult = useFetchDataHook(id ?? 0, open)
  const { data } = queryResult as { data: ResultOfQuery | undefined }
  const [formData, setFormData] = useState<Submission>(initialFormData)

  useEffect(() => {
    if (id && open && data) {
      const mappedData = mapDataToFormData
        ? mapDataToFormData(data)
        : (data as Submission)
      setFormData(mappedData)
    }
  }, [id, open, data, mapDataToFormData])

  const handleInputChange = (
    key: keyof Submission,
    value: string | number | object
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }))
  }

  const resetFormData = () => {
    setFormData(initialFormData)
  }

  const handleSubmitWithEvent = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()
    if (id) {
      await handleUpdate(formData)
    } else {
      await handleCreate(formData)
    }
    setOpen(false)
    resetFormData()
  }

  return (
    <ModalForm
      formId={formId}
      label={label}
      title={title}
      open={open}
      setOpen={setOpen}
    >
      <FormComponent
        formData={formData}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmitWithEvent}
        formId={formId}
      />
    </ModalForm>
  )
}

export default GenericForm
