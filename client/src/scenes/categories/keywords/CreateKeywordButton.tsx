import { useState } from "react"
import KeywordModal from "@/scenes/categories/keywords/KeywordModal"
import { Add } from "@mui/icons-material"
import { IconButton } from "@mui/material"

export default function CreateKeywordButton({
  placeholder,
}: {
  placeholder?: string
}) {
  const [open, setOpen] = useState(false)

  const handleOpen = () => {
    setOpen(true)
  }

  return (
    <>
      <IconButton onClick={handleOpen}>
        <Add />
      </IconButton>
      <KeywordModal open={open} setOpen={setOpen} placeholder={placeholder} />
    </>
  )
}
