import React, { useState } from "react"
import {
  useGetAccountsQuery,
  useGetCategoriesQuery,
  useCreateTransactionMutation,
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
import ModalForm from "@/components/ModalForm"

function TransactionForm() {
  const { data: accounts } = useGetAccountsQuery()
  const { data: categories } = useGetCategoriesQuery()
  const [createTransaction] = useCreateTransactionMutation()
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState(0)
  const [accountId, setAccountId] = useState("")
  const [date, setDate] = useState<Dayjs>(dayjs())
  const [categoryId, setCategoryId] = useState("")

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const transactionData = {
      description,
      amount: Number(amount),
      account_id: Number(accountId),
      date: date.format("YYYY-MM-DD"),
      category_id: Number(categoryId),
    }

    try {
      const response = await createTransaction(transactionData).unwrap()
      alert(`transaction successfully created with id ${response.id}.`)
    } catch (error: unknown) {
      alert(`Transaction could not be created: ${error.data.message}`)
    }
  }

  const thisFormId = "create-transaction-form"

  return (
    <ModalForm
      formId={thisFormId}
      label="Create Transaction"
      title="Create a transaction"
      disabled={false}
    >
      <form onSubmit={handleSubmit} id={thisFormId}>
        <FormGroup>
          <FormControl fullWidth>
            <InputLabel id="account-select-label">Account</InputLabel>
            <Select
              id="account-select"
              labelId="account-select-label"
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
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

          <FormControl fullWidth>
            <TextField
              id="amount"
              label="Amount"
              variant="outlined"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </FormControl>

          <FormControl fullWidth>
            <DateField
              label="Date"
              value={date}
              onChange={(newValue) => setDate(newValue ? newValue : dayjs())}
            />
          </FormControl>
        </FormGroup>
      </form>
    </ModalForm>
  )
}

export default TransactionForm
