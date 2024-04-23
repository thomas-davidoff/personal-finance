import { useGetCategoriesQuery } from "@/state/api"
import { Box } from "@mui/material"
import MostCommonWords from "@/scenes/categories/mostCommonWords"
import AllKeywordsTable from "@/scenes/categories/AllKeywords"
import AddCategoryForm from "@/scenes/categories/AddCategoryForm"
import DeleteCategoryButton from "@/scenes/categories/deleteCategoryButton"
import { useState, useEffect } from "react"
import {
  GridColDef,
  GridRowId,
  GridRowsProp,
  GridRowModesModel,
} from "@mui/x-data-grid"
import StyledDataGrid from "@/components/StyledDataGrid"
import UpdateCategoryForm from "@/scenes/categories/UpdateCategoryForm"

const CategoriesView = () => {
  const { data: categories } = useGetCategoriesQuery()
  const [selectedRowIds, setSelectedRowIds] = useState<Array<GridRowId>>([])
  const [rows, setRows] = useState<GridRowsProp>([])
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({})

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Category Name",
      width: 200,
    },
    { field: "description", headerName: "Description", width: 400 },
    {
      field: "numTransactions",
      headerName: "Number of Transactions",
      width: 150,
      type: "number",
    },
    { field: "transactionType", headerName: "Type", width: 125 },
    { field: "transactionSubtype", headerName: "Subtype", width: 125 },
  ]

  useEffect(() => {
    if (categories) {
      const mappedRows: GridRowsProp = categories.map((datum) => ({
        id: datum.id,
        name: datum.name,
        description: datum.description,
        numTransactions: datum.num_transactions,
        transactionType: datum.transaction_type?.toLowerCase(),
        transactionSubtype: datum.transaction_subtype?.toLowerCase(),
      }))
      setRows(mappedRows)
    }
  }, [categories])
  return (
    <Box display="grid" gap="1.5rem">
      <Box
        sx={{
          display: "grid",
          border: "1px solid yellow",
          gridTemplateColumns: "1fr 3fr",
        }}
      >
        <Box
          sx={{
            border: "1px solid green",
          }}
        >
          <DeleteCategoryButton categoryId={selectedRowIds} />
          <UpdateCategoryForm categoryId={selectedRowIds} />
          <AddCategoryForm />
        </Box>

        <Box sx={{ border: "1px solid purple" }}>
          {categories && (
            <StyledDataGrid
              rows={rows}
              columns={columns}
              rowModesModel={rowModesModel}
              onRowModesModelChange={(model) => setRowModesModel(model)}
              onRowSelectionModelChange={(newSelectionModel) => {
                setSelectedRowIds(newSelectionModel)
              }}
              sx={{ height: "100%" }}
            />
          )}
        </Box>
      </Box>
      <MostCommonWords />
      <AllKeywordsTable />
    </Box>
  )
}

export default CategoriesView
