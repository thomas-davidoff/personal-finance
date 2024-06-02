import TransactionModal from "@/scenes/transactions/transactionModal"
import { useState } from "react"
import { Button } from "@mui/material"
import { Add } from "@mui/icons-material"

export default function CreateTransactionButton() {
  const [open, setOpen] = useState(false)

  const handleOpen = () => {
    setOpen(true)
  }

  return (
    <>
      <Button onClick={handleOpen} startIcon={<Add />}>
        Create a Transaction
      </Button>
      <TransactionModal open={open} setOpen={setOpen} />
    </>
  )
}
