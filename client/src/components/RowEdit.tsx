import { useDeleteCategoryMutation } from "@/state/api"
import { useState, useEffect } from "react"
import UpdateCategoryForm2 from "@/scenes/categories/UpdateCat2"
import IconButton from "@mui/material/IconButton"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import { GridRowId } from "@mui/x-data-grid"

interface RowEditProps {
  rowId: number
  setSelectedRowIds: React.Dispatch<React.SetStateAction<GridRowId[]>>
}

export default function RowEdit({ rowId, setSelectedRowIds }: RowEditProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  useEffect(() => {
    if (open) {
      setSelectedRowIds([rowId])
    }
  }, [open])

  const [modalOpen, setModalOpen] = useState(false)

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleOpenModal = () => {
    handleClose() // Close the menu
    setTimeout(() => {
      // Delay the modal opening to ensure menu closes smoothly
      setModalOpen(true)
    }, 100)
  }

  const [deleteCategory] = useDeleteCategoryMutation()

  const handleDeleteCategory = async () => {
    handleClose()
    try {
      const response = await deleteCategory(Number(rowId)).unwrap()
      alert(response.message)
    } catch (error: unknown) {
      if (typeof error === "string") {
        error.toUpperCase()
      } else if (error instanceof Error || error instanceof Object) {
        if ("message" in error) {
          alert(`Category could not be deleted: ${error.message}`)
        }
      } else {
        alert("There was a problem deleting the category.")
        console.error(error)
      }
    }
  }

  return (
    <div>
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleOpenModal}>Update</MenuItem>
        <MenuItem onClick={handleDeleteCategory}>Delete</MenuItem>
      </Menu>
      <UpdateCategoryForm2
        open={modalOpen}
        setOpen={setModalOpen}
        categoryId={rowId}
      />
    </div>
  )
}
