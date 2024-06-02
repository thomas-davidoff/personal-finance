import { useState } from "react"
import CategoryModal from "@/scenes/categories/categoryModal"
import { Button } from "@mui/material"

export default function CreateCategoryButton() {
  const [open, setOpen] = useState(false)

  const handleOpen = () => {
    setOpen(true)
  }

  return (
    <>
      <Button onClick={handleOpen}>Create a Category</Button>
      <CategoryModal open={open} setOpen={setOpen} />
    </>
  )
}
