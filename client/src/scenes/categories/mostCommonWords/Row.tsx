import React, { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Collapse,
  Box,
  Typography,
  IconButton,
} from "@mui/material"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp"
import AddKeywordForm from "@/scenes/categories/mostCommonWords/addKeywordForm"
import { getCommonDescriptionWordsResponse } from "@/state/types"

interface NestedRowProps {
  row: getCommonDescriptionWordsResponse
}

export default function NestedRow({ row }: NestedRowProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.phrase}
        </TableCell>
        <TableCell>{row.count}</TableCell>
        <TableCell>{row.avg_amount.toFixed(2)}</TableCell>
        <TableCell>{row.total_amount.toFixed(2)}</TableCell>
        <TableCell>
          <AddKeywordForm placeholderKeyword={row.phrase} />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Detailed Information
              </Typography>
              <Table size="small" aria-label="details">
                <TableHead>
                  <TableRow>
                    <TableCell>Description</TableCell>
                    <TableCell>Count</TableCell>
                    <TableCell>Account</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.combos.map((detailRow) => (
                    <TableRow key={detailRow.key.description}>
                      <TableCell>{detailRow.key.description}</TableCell>
                      <TableCell>{detailRow.count}</TableCell>
                      <TableCell>{detailRow.key.account}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}
