import React, { useState } from "react"
import { useCreateCategoryMutation } from "@/state/api"
import {
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  TextField,
  FormGroup,
} from "@mui/material"
import ModalForm from "@/components/ModalForm"
import {
  transactionTypes,
  transactionSubtypes,
} from "@/scenes/categories/constants"

function AddCategoryForm() {
  const [createCategory] = useCreateCategoryMutation()
  const [description, setDescription] = useState("")
  const [name, setName] = useState("")
  const [transactionType, setTransactionType] = useState("")
  const [transactionSubtype, setTransactionSubtype] = useState("")

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const categoryData = {
      name,
      description,
      transaction_type: transactionType,
      transaction_subtype: transactionSubtype,
    }

    try {
      const response = await createCategory(categoryData).unwrap()
      alert(`Category successfully created with id ${response.id}.`)
    } catch (error: unknown) {
      if (typeof error === "string") {
        error.toUpperCase()
      } else if (error instanceof Error || error instanceof Object) {
        if ("message" in error) {
          alert(`Category could not be created: ${error.message}`)
        }
      } else {
        alert("There was a problem creating the category.")
        console.error(error)
      }
    }
  }

  const thisFormId = "create-category-form"

  return (
    <ModalForm
      formId={thisFormId}
      label="Create Category"
      title="Create a category"
      disabled={false}
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

export default AddCategoryForm
