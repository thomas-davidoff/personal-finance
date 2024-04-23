import React, { useState } from "react"
import { useGetCategoriesQuery, useCreateKeywordMutation } from "@/state/api"
import {
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  TextField,
  FormGroup,
} from "@mui/material"
import ModalForm from "@/components/ModalForm"
import AddIcon from "@mui/icons-material/Add"

interface AddKeywordProps {
  placeholderKeyword: string
}

function AddKeywordForm({ placeholderKeyword }: AddKeywordProps) {
  const { data: categories } = useGetCategoriesQuery()
  const [createKeyword] = useCreateKeywordMutation()

  const [description, setDescription] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [keyword, setKeyword] = useState(placeholderKeyword)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const keywordData = {
      keyword,
      description,
      category_id: Number(categoryId),
    }

    try {
      const response = await createKeyword(keywordData).unwrap()
      alert(`Keyword successfully created with id ${response.id}.`)
    } catch (error: unknown) {
      if (typeof error === "string") {
        error.toUpperCase()
      } else if (error instanceof Error || error instanceof Object) {
        if ("message" in error) {
          alert(`Keyword could not be created: ${error.message}`)
        }
      } else {
        alert("There was a problem creating the keyword.")
        console.error(error)
      }
    }
  }

  const thisFormId = "create-keyword-form"

  return (
    <ModalForm
      formId={thisFormId}
      label="Create Keyword"
      title="Create a keyword"
      disabled={false}
      iconButton={<AddIcon />}
    >
      <form onSubmit={handleSubmit} id={thisFormId}>
        <FormGroup>
          <FormControl fullWidth>
            <TextField
              id="keyword-field"
              label="Keyword"
              variant="outlined"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="category-select-label">Category</InputLabel>
            <Select
              id="category-select"
              labelId="category-select-label"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              {categories?.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.name}
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

export default AddKeywordForm
