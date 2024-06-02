import { FormProps } from "@/components/types"
import { CategorySubmissionProps } from "@/state/types"
import React from "react"
import { useGetColorSchemeQuery } from "@/state/api"
import {
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  TextField,
  FormGroup,
} from "@mui/material"
import {
  transactionTypes,
  transactionSubtypes,
} from "@/scenes/categories/constants"
import CategoryColorPill from "@/components/CategoryColorPill"

const CategoryForm: React.FC<FormProps<CategorySubmissionProps>> = ({
  handleSubmit,
  formId,
  formData,
  handleInputChange,
}) => {
  const { data: colors } = useGetColorSchemeQuery()

  return (
    <form onSubmit={handleSubmit} id={formId}>
      <FormGroup sx={{ gap: "20px" }}>
        <FormControl fullWidth>
          <TextField
            id="category-name-field"
            label="Category Name"
            variant="outlined"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
          />
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="transaction-type-select-label">
            Transaction Type
          </InputLabel>
          <Select
            id="transaction-type-select-field"
            labelId="transaction-type-select-label"
            value={formData.transactionType}
            onChange={(e) =>
              handleInputChange("transactionType", e.target.value)
            }
          >
            {transactionTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="color-select-label">Color</InputLabel>
          <Select
            id="color-select-field"
            labelId="color-select-label"
            value={formData.color}
            onChange={(e) => handleInputChange("color", e.target.value)}
          >
            {colors?.map((c) => (
              <MenuItem key={c.key} value={c.key} sx={{ color: c.foreground }}>
                <CategoryColorPill label={c.label} colorKey={c.key} />
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
            value={formData.transactionSubtype}
            onChange={(e) =>
              handleInputChange("transactionSubtype", e.target.value)
            }
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
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
          />
        </FormControl>
      </FormGroup>
    </form>
  )
}

export default CategoryForm
