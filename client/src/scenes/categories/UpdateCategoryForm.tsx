import React, { useState, useEffect } from "react"
import { useUpdateCategoryMutation, useGetCategoryQuery } from "@/state/api"
import {
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  TextField,
  FormGroup,
} from "@mui/material"
import { GridRowId } from "@mui/x-data-grid"
import ModalForm from "@/components/ModalForm"
import {
  transactionTypes,
  transactionSubtypes,
} from "@/scenes/categories/constants"

interface Props {
  categoryId: GridRowId[]
}

function UpdateCategoryForm({ categoryId }: Props) {
  const [name, setName] = useState("")
  const [transactionType, setTransactionType] = useState("")
  const [transactionSubtype, setTransactionSubtype] = useState("")
  const cId = Number(categoryId[0])
  const { data: category } = useGetCategoryQuery(cId, {
    skip: isNaN(cId),
  })

  const [updateCategory] = useUpdateCategoryMutation()

  const [description, setDescription] = useState("")

  useEffect(() => {
    if (category) {
      setDescription(category.description || "")
      setName(category.name || "")
      setTransactionType(category.transaction_type || "")
      setTransactionSubtype(category.transaction_subtype || "")
    }
  }, [categoryId])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const categoryData = {
      id: cId,
      data: {
        name: name,
        description,
        transaction_type: transactionType,
        transaction_subtype: transactionSubtype,
      },
    }

    try {
      const response = await updateCategory(categoryData).unwrap()
      alert(`Category successfully updated with id ${response.id}.`)
    } catch (error: unknown) {
      if (typeof error === "string") {
        error.toUpperCase() // works, `e` narrowed to string
      } else if (error instanceof Error) {
        alert(`Category could not be updated: ${error.message}`)
      } else {
        alert("There was a problem performing the update.")
        console.error(error)
      }
    }
  }

  const thisFormId = "update-category-form"

  return (
    <ModalForm
      formId={thisFormId}
      label="Update Category"
      title="Update a category"
      disabled={isNaN(cId)}
    >
      <form onSubmit={handleSubmit} id={thisFormId}>
        <FormGroup>
          <FormControl fullWidth>
            <TextField
              id="category-name-field"
              label="Category Name"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="transaction-type-select-label">
              Transaction Type
            </InputLabel>
            <Select
              id="transaction-type-select-field"
              labelId="transaction-type-select-label"
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value)}
            >
              {transactionTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="transaction-subtype-select-label">
              Transaction Subtype
            </InputLabel>
            <Select
              id="transaction-subtype-select-field"
              labelId="transaction-subtype-select-label"
              value={transactionSubtype}
              onChange={(e) => setTransactionSubtype(e.target.value)}
            >
              {transactionSubtypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <TextField
              id="description"
              label="Description"
              variant="outlined"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormControl>
        </FormGroup>
      </form>
    </ModalForm>
  )
}

export default UpdateCategoryForm
