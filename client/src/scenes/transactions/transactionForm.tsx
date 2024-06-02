import React from "react"
import {
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  TextField,
  FormGroup,
} from "@mui/material"
import { DateField } from "@mui/x-date-pickers/DateField"
import dayjs from "dayjs"
import CategoryColorPill from "@/components/CategoryColorPill"
import { useGetAccountsQuery, useGetCategoriesQuery } from "@/state/api"
import { FormProps } from "@/components/types"
import { TransactionSubmissionProps } from "@/state/types"

const TransactionForm: React.FC<FormProps<TransactionSubmissionProps>> = ({
  handleSubmit,
  formId,
  formData,
  handleInputChange,
}) => {
  const { data: accounts } = useGetAccountsQuery()
  const { data: categories } = useGetCategoriesQuery()
  return (
    <form onSubmit={handleSubmit} id={formId}>
      <FormGroup>
        <FormControl fullWidth>
          <InputLabel id="account-select-label">Account</InputLabel>
          <Select
            id="account-select"
            labelId="account-select-label"
            value={formData.account.id}
            onChange={(e) =>
              handleInputChange("account", { id: Number(e.target.value) })
            }
          >
            {accounts?.map((acc) => (
              <MenuItem key={acc.id} value={acc.id}>
                {acc.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="category-select-label">Category</InputLabel>
          <Select
            id="category-select"
            labelId="category-select-label"
            value={formData.category.id}
            onChange={(e) =>
              handleInputChange("category", { id: Number(e.target.value) })
            }
          >
            {categories?.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                <CategoryColorPill label={cat.name} colorKey={cat.color} />
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

        <FormControl fullWidth>
          <TextField
            id="amount"
            label="Amount"
            variant="outlined"
            type="number"
            value={formData.amount}
            onChange={(e) =>
              handleInputChange("amount", Number(e.target.value))
            }
          />
        </FormControl>

        <FormControl fullWidth>
          <DateField
            label="Date"
            value={dayjs(formData.date)}
            onChange={(newValue) =>
              handleInputChange(
                "date",
                newValue
                  ? newValue.format("YYYY-MM-DD")
                  : dayjs().format("YYYY-MM-DD")
              )
            }
          />
        </FormControl>
      </FormGroup>
    </form>
  )
}

export default TransactionForm
