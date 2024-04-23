// CategoriesForm.jsx
import React from "react"
import { FormControl, TextField, FormGroup } from "@mui/material"

interface queryParams {
  minConsecutive: number
  minWordLength: number
  ignoredWords: string
  numberToReturn: number
}
interface CategoriesFormProps {
  queryParams: queryParams
  setQueryParams: React.Dispatch<React.SetStateAction<queryParams>>
}

function CategoriesForm({ queryParams, setQueryParams }: CategoriesFormProps) {
  return (
    <FormGroup sx={{ border: "1px solid red" }}>
      <FormControl fullWidth>
        <TextField
          id="min-consecutive"
          label="Minimum Consecutive Words"
          variant="outlined"
          type="number"
          value={queryParams.minConsecutive}
          onChange={(e) => {
            setQueryParams({
              ...queryParams,
              minConsecutive: Number(e.target.value),
            })
          }}
        />
      </FormControl>
      <FormControl fullWidth>
        <TextField
          id="min-word-length"
          label="Minimum Word Length"
          variant="outlined"
          type="number"
          value={queryParams.minWordLength}
          onChange={(e) => {
            setQueryParams({
              ...queryParams,
              minWordLength: Number(e.target.value),
            })
          }}
        />
      </FormControl>
      <FormControl fullWidth>
        <TextField
          id="ignored-words"
          label="Ignored Words"
          variant="outlined"
          value={queryParams.ignoredWords}
          onChange={(e) => {
            setQueryParams({
              ...queryParams,
              ignoredWords: e.target.value,
            })
          }}
        />
      </FormControl>
      <FormControl fullWidth>
        <TextField
          id="number-to-find"
          label="Number to Find"
          variant="outlined"
          type="number"
          value={queryParams.numberToReturn}
          onChange={(e) => {
            setQueryParams({
              ...queryParams,
              numberToReturn: Number(e.target.value),
            })
          }}
        />
      </FormControl>
    </FormGroup>
  )
}

export default CategoriesForm
