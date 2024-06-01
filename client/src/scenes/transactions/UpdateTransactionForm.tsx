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
  const tId = Number(id)
  const { data: transaction } = useGetTransactionQuery(tId, {
    skip: isNaN(tId) || !open,
  })

  const [updateTransaction] = useUpdateTransactionMutation()

  const [description, setDescription] = useState(transaction?.description || "")
  const [amount, setAmount] = useState(transaction?.amount || 0)
  const [accountId, setAccountId] = useState(transaction?.account.id || 0)
  const [date, setDate] = useState<Dayjs>(dayjs())
  const [categoryId, setCategoryId] = useState(transaction?.category?.id || 0)

  useEffect(() => {
    if (transaction && open) {
      setDescription(transaction.description || "")
      setAmount(transaction.amount || 0)
      setAccountId(transaction.account?.id)
      setDate(dayjs(transaction.date || dayjs()))
      setCategoryId(transaction.category?.id || 0)
    }
  }, [open, transaction])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const transactionData = {
      description,
      amount: Number(amount),
      date: date.format("YYYY-MM-DD"),
      category_id: categoryId,
      account_id: accountId,
    }
    try {
      const response = await updateTransaction({
        transactionId: tId,
        transactionData,
      }).unwrap()
      alert(`transaction successfully created with id ${response.id}.`)
    } catch (error: unknown) {
      alert(`Transaction could not be created: ${error.data.message}`)
    }
  }

  return (
    <ModalForm2
      formId={thisFormId}
      label="Update Transaction"
      title="Update a transaction"
      disabled={isNaN(tId)}
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
    </ModalForm2>
  )
}

export default UpdateTransactionForm
