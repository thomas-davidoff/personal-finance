import { styled } from "@mui/material/styles"
import { DataGrid as MuiDataGrid } from "@mui/x-data-grid"

const StyledDataGrid = styled(MuiDataGrid)(() => ({
  border: 0,
  borderRadius: "1rem",
  boxShadow: "0.15rem 0.2rem 0.15rem 0.1rem rgba(0, 0, 0, .1)",
  height: "100%",
  "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
    outline: "none !important",
  },
}))

export default StyledDataGrid
