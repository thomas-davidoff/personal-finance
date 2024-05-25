import React from "react"
import { Button, Modal, Box, Typography } from "@mui/material"
import { useTheme } from "@mui/material"
import { bgcolor, borderRadius } from "@mui/system"

interface ModalProps {
  title: string
  label: string
  formId: string
  children: JSX.Element
  disabled: boolean
  iconButton?: JSX.Element
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

function ModalForm({ title, formId, children, open, setOpen }: ModalProps) {
  const handleClose = () => setOpen(false)
  const { palette } = useTheme()

  const style = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    boxShadow: 24,
    p: 4,
    bgcolor: palette.background.light,
    borderRadius: "20px",
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography variant="h3" gutterBottom>
          {title}
        </Typography>
        <Box mt={2}>{children}</Box>
        <Button type="submit" form={formId}>
          Submit
        </Button>
        <Button onClick={handleClose}>Cancel</Button>
      </Box>
    </Modal>
  )
}

export default ModalForm
