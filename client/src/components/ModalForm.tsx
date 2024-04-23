import React from "react"
import { Button, Modal, Box, Typography, IconButton } from "@mui/material"

interface ModalProps {
  title: string
  label: string
  formId: string
  children: JSX.Element
  disabled: boolean
  iconButton?: JSX.Element
}

function ModalForm({
  title,
  label,
  formId,
  children,
  disabled,
  iconButton,
}: ModalProps) {
  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const style = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  }

  return (
    <Box>
      {iconButton ? (
        <IconButton onClick={handleOpen} disabled={disabled}>
          {iconButton}
        </IconButton>
      ) : (
        <Button onClick={handleOpen} disabled={disabled} variant="outlined">
          {label}
        </Button>
      )}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography variant="h4">{title}</Typography>
          {children}
          <Button type="submit" form={formId}>
            Submit
          </Button>
          <Button onClick={handleClose}>Cancel</Button>
        </Box>
      </Modal>
    </Box>
  )
}

export default ModalForm
