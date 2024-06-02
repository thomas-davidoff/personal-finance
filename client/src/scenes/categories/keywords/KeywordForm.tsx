import React from "react"
import { useGetCategoriesQuery } from "@/state/api"
import {
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  TextField,
  FormGroup,
} from "@mui/material"
import { FormProps } from "@/components/types"
import { KeywordSubmissionProps } from "@/state/types"

const KeywordForm: React.FC<FormProps<KeywordSubmissionProps>> = ({
  handleSubmit,
  formId,
  formData,
  handleInputChange,
}) => {
  const { data: categories } = useGetCategoriesQuery()

  return (
    <form onSubmit={handleSubmit} id={formId}>
      <FormGroup>
        <FormControl fullWidth>
          <TextField
            id="keyword-field"
            label="Keyword"
            variant="outlined"
            value={formData.keyword}
            onChange={(e) => handleInputChange("keyword", e.target.value)}
          />
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="category-select-label">Category</InputLabel>
          <Select
            id="category-select"
            labelId="category-select-label"
            value={formData.categoryId}
            onChange={(e) => handleInputChange("categoryId", e.target.value)}
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
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
          />
        </FormControl>
      </FormGroup>
    </form>
  )
}

export default KeywordForm
