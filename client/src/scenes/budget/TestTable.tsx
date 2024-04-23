import { DataGrid } from "@mui/x-data-grid"
import {
  GridColDef,
  GridRowId,
  GridRowsProp,
  GridRowModesModel,
} from "@mui/x-data-grid"
import { Box } from "@mui/material"

export default function TestTable() {
  const data = [
    {
      id: 1,
      name: "lkmasdlkmasd",
      description: "lkmsdflkmsdflkmsdflmk",
      value: 1,
    },
    {
      id: 2,
      name: "lkmasdlkmasd",
      description: "lkmsdflkmsdflkmsdflmk",
      value: 2,
    },
    {
      id: 3,
      name: "lkmasdlkmasd",
      description: "lkmsdflkmsdflkmsdflmk",
      value: 3,
    },
    {
      id: 4,
      name: "lkmasdlkmasd",
      description: "lkmsdflkmsdflkmsdflmk",
      value: 4,
    },
    {
      id: 5,
      name: "lkmasdlkmasd",
      description: "lkmsdflkmsdflkmsdflmk",
      value: 5,
    },
  ]
  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
    },
    {
      field: "description",
      headerName: "Description",
    },
    {
      field: "value",
      headerName: "Value",
    },
  ]
  const rows: GridRowsProp = data.map((datum) => ({
    id: datum.id,
    name: datum.name,
    description: datum.description,
    value: datum.value,
  }))
  return (
    <Box>
      <DataGrid rows={rows} columns={columns} />
    </Box>
  )
}
