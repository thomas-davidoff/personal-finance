import React, { useState, useEffect } from "react"
import {
  useUpdateCategoryMutation,
  useGetCategoryQuery,
  useGetColorSchemeQuery,
} from "@/state/api"
import {
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  TextField,
  FormGroup,
} from "@mui/material"
import ModalForm2 from "@/components/ModalForm2"
import {
  transactionTypes,
  transactionSubtypes,
} from "@/scenes/categories/constants"
import CategoryColorPill from "@/components/CategoryColorPill"

interface Props {
  id: number
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

function UpdateCategoryForm({ id, open, setOpen }: Props) {
  const { data: category } = useGetCategoryQuery(id, {
    skip: !open,
  })
  const { data: colors } = useGetColorSchemeQuery()
  const [updateCategory] = useUpdateCategoryMutation()

  const [formData, setFormData] = useState({
    name: "",
    transactionType: "",
    color: "grey",
    transactionSubtype: "",
    description: "",
  })

  // use effect to set form data when the category is fetched at modal open
  useEffect(() => {
    if (category && open) {
      setFormData({
        name: category.name || "",
        transactionType: category.transaction_type || "",
        color: category.color || "",
        transactionSubtype: category.transaction_subtype || "",
        description: category.description || "",
      })
    }
  }, [open, category])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const categoryData = {
      id,
      data: {
        name: formData.name,
        description: formData.description,
        transaction_type: formData.transactionType,
        transaction_subtype: formData.transactionSubtype,
        color: formData.color,
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

  const handleInputChange = (updateKey: string, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [updateKey]: value,
    }))
  }

  const thisFormId = "update-category-form"

  return (
    <ModalForm2
      formId={thisFormId}
      label="Update Category"
      title="Update a category"
      disabled={isNaN(id)}
      open={open}
      setOpen={setOpen}
    >
      <form onSubmit={handleSubmit} id={thisFormId}>
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
                <MenuItem
                  key={c.key}
                  value={c.key}
                  sx={{ color: c.foreground }}
                >
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
    </ModalForm2>
  )
}

export default UpdateCategoryForm
