import React, { useState, useEffect } from "react"
import {
  useGetAccountsQuery,
  useGetCategoriesQuery,
  useGetTransactionQuery,
  useUpdateTransactionMutation,
} from "@/state/api"
import {
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  TextField,
  FormGroup,
} from "@mui/material"
import { DateField } from "@mui/x-date-pickers/DateField"
import dayjs, { Dayjs } from "dayjs"
import CategoryColorPill from "@/components/CategoryColorPill"

import ModalForm2 from "@/components/ModalForm2"

interface Props {
  id: number
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

function UpdateTransactionForm({ id, open, setOpen }: Props) {
  const thisFormId = "update-transaction-form"

  const { data: accounts } = useGetAccountsQuery()
  const { data: categories } = useGetCategoriesQuery()
  const { data: transaction } = useGetTransactionQuery(id, {
    skip: !open,
  })

  const [updateTransaction] = useUpdateTransactionMutation()

  const [formData, setFormData] = useState({
    description: "",
    amount: 0,
    accountId: 0,
    date: dayjs(),
    categoryId: 0,
  })

  useEffect(() => {
    if (transaction && open) {
      setFormData({
        description: transaction.description || "",
        amount: transaction.amount || 0,
        accountId: transaction.account?.id,
        date: dayjs(transaction.date) || dayjs(),
        categoryId: transaction.category?.id || 0,
      })
    }
  }, [open, transaction])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const transactionData = {
      description: formData.description,
      amount: Number(formData.amount),
      date: formData.date.format("YYYY-MM-DD"),
      category_id: formData.categoryId,
      account_id: formData.accountId,
    }
    try {
      const response = await updateTransaction({
        transactionId: id,
        transactionData,
      }).unwrap()
      alert(`transaction successfully created with id ${response.id}.`)
    } catch (error: unknown) {
      alert(`Transaction could not be created: ${error.data.message}`)
    }
  }

  const handleInputChange = (
    updateKey: string,
    value: string | number | Dayjs
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      [updateKey]: value,
    }))
  }

  return (
    <ModalForm2
      formId={thisFormId}
      label="Update Transaction"
      title="Update a transaction"
      disabled={!id}
      open={open}
      setOpen={setOpen}
    >
      <form onSubmit={handleSubmit} id={thisFormId}>
        <FormGroup>
          <FormControl fullWidth>
            <InputLabel id="account-select-label">Account</InputLabel>
            <Select
              id="account-select"
              labelId="account-select-label"
              value={formData.accountId}
              onChange={(e) =>
                handleInputChange("accountId", Number(e.target.value))
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
              value={formData.categoryId}
              onChange={(e) =>
                handleInputChange("categoryId", Number(e.target.value))
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
              value={formData.date}
              onChange={(newValue) =>
                handleInputChange("date", newValue ? newValue : dayjs())
              }
            />
          </FormControl>
        </FormGroup>
      </form>
    </ModalForm2>
  )
}

export default UpdateTransactionForm
