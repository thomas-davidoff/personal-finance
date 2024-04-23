import { styled } from "@mui/material/styles"
import { DataGrid as MuiDataGrid } from "@mui/x-data-grid"

const StyledDataGrid = styled(MuiDataGrid)(({ theme }) => ({
  border: 0,
  borderRadius: "1rem",
  boxShadow: "0.15rem 0.2rem 0.15rem 0.1rem rgba(0, 0, 0, .1)",
  // '& .MuiDataGrid-columnHeaders': {
  //   backgroundColor: theme.palette.grey[400],
  // },
  // '& .MuiCheckbox-root': {
  //   color: theme.palette.grey[400],
  // },
  // '& .Mui-checked': {
  //   color: theme.palette.primary.main,
  // },
  // '& .MuiDataGrid-cell': {
  //   color: theme.palette.grey[400],
  // },
  // '& .MuiDataGrid-footerContainer': {
  //   backgroundColor: theme.palette.grey[400],
  // },
}))

export default StyledDataGrid
