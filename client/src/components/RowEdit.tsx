import { useState } from "react"
import IconButton from "@mui/material/IconButton"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import { ListItemIcon } from "@mui/material"
import { Create } from "@mui/icons-material"
import DeleteIcon from "@mui/icons-material/Delete"

interface RowEditProps {
  rowId: number
  UpdateModal: React.FunctionComponent<{
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    id: number
  }>
  handleDelete: (rowId: number) => Promise<void>
}

export default function RowEdit({
  rowId,
  UpdateModal,
  handleDelete,
}: RowEditProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const [modalOpen, setModalOpen] = useState(false)

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleOpenModal = () => {
    handleClose()
    setTimeout(() => {
      setModalOpen(true)
    }, 100)
  }

  const handleDeleteRow = async () => {
    handleClose()
    await handleDelete(rowId)
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
        <MenuItem onClick={handleOpenModal}>
          <ListItemIcon>
            <Create />
          </ListItemIcon>
          Update
        </MenuItem>
        <MenuItem onClick={handleDeleteRow}>
          <ListItemIcon>
            <DeleteIcon />
          </ListItemIcon>
          Delete
        </MenuItem>
      </Menu>
      <UpdateModal open={modalOpen} setOpen={setModalOpen} id={rowId} />
    </div>
  )
}
