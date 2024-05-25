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
import { GridRowId } from "@mui/x-data-grid"
import ModalForm2 from "@/components/ModalForm2"
import {
  transactionTypes,
  transactionSubtypes,
} from "@/scenes/categories/constants"
import CategoryColorPill from "@/components/CategoryColorPill"

interface Props {
  categoryId: GridRowId[]
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

function UpdateCategoryForm2({ categoryId, open, setOpen }: Props) {
  const [name, setName] = useState("")
  const [transactionType, setTransactionType] = useState("")
  const [color, setColor] = useState("grey")
  const [transactionSubtype, setTransactionSubtype] = useState("")
  const [cId, setcId] = useState(Number(categoryId[0])) // Initial set from props
  const { data: category } = useGetCategoryQuery(cId, {
    skip: isNaN(cId),
  })
  const { data: colors } = useGetColorSchemeQuery()
  const [updateCategory] = useUpdateCategoryMutation()
  const [description, setDescription] = useState("")

  // Effect to update cId when categoryId changes
  useEffect(() => {
    setcId(Number(categoryId[0]))
  }, [categoryId])

  // Separate effect to log and update other states when cId changes
  useEffect(() => {
    console.log(`new selection: ${cId}`) // Correct place to log the updated cId
    if (category) {
      setDescription(category.description || "")
      setColor(category.color || "")
      setName(category.name || "")
      setTransactionType(category.transaction_type || "")
      setTransactionSubtype(category.transaction_subtype || "")
    }
  }, [cId, category]) // Notice cId is a dependency now

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const categoryData = {
      id: cId,
      data: {
        name: name,
        description,
        transaction_type: transactionType,
        transaction_subtype: transactionSubtype,
        color,
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
    <ModalForm2
      formId={thisFormId}
      label="Update Category"
      title="Update a category"
      disabled={isNaN(cId)}
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
            <InputLabel id="color-select-label">Color</InputLabel>
            <Select
              id="color-select-field"
              labelId="color-select-label"
              value={color}
              onChange={(e) => setColor(e.target.value)}
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
    </ModalForm2>
  )
}

export default UpdateCategoryForm2
