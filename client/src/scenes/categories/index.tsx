import { useGetCategoriesQuery } from "@/state/api"
import { Box } from "@mui/material"
import MostCommonWords from "@/scenes/categories/mostCommonWords"
import AllKeywordsTable from "@/scenes/categories/AllKeywords"
import AddCategoryForm from "@/scenes/categories/AddCategoryForm"
import { useState, useEffect } from "react"
import {
  GridColDef,
  GridRowId,
  GridRowsProp,
  GridRowModesModel,
} from "@mui/x-data-grid"
import StyledDataGrid from "@/components/StyledDataGrid"
import CategoryColorPill from "@/components/CategoryColorPill"
import RowEdit from "@/components/RowEdit"
import UpdateCategoryForm2 from "@/scenes/categories/UpdateCat2"
import { useHandleDeleteCategory } from "@/hooks/useHandleDeleteCategory"

const CategoriesView = () => {
  const { data: categories } = useGetCategoriesQuery()
  const [selectedRowIds, setSelectedRowIds] = useState<Array<GridRowId>>([])
  const [rows, setRows] = useState<GridRowsProp>([])
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({})

  const handleDeleteCategory = useHandleDeleteCategory()

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Category Name",
      width: 200,
      renderCell: (params) => (
        <CategoryColorPill
          label={params.value.name}
          colorKey={params.value.color}
        />
      ),
    },
    { field: "description", headerName: "Description", width: 400 },
    {
      field: "numTransactions",
      headerName: "Number of Transactions",
      type: "number",
      flex: 1,
    },
    { field: "transactionType", headerName: "Type", flex: 1 },
    { field: "transactionSubtype", headerName: "Subtype", flex: 1 },
    {
      field: "edit",
      headerName: "Edit",
      flex: 1,
      renderCell: (params) => (
        <RowEdit
          rowId={params.row.id}
          setSelectedRowIds={setSelectedRowIds}
          UpdateModal={UpdateCategoryForm2}
          handleDelete={handleDeleteCategory}
        />
      ),
      sortable: false,
    },
  ]

  useEffect(() => {
    if (categories) {
      const mappedRows: GridRowsProp = categories.map((datum) => ({
        id: datum.id,
        name: { name: datum.name, color: datum.color },
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
      {selectedRowIds}
      <Box>
        <AddCategoryForm />
        {categories && (
          <StyledDataGrid
            rows={rows}
            columns={columns}
            rowModesModel={rowModesModel}
            onRowModesModelChange={(model) => setRowModesModel(model)}
            onRowSelectionModelChange={(newSelectionModel) => {
              setSelectedRowIds(newSelectionModel)
            }}
            sx={{
              height: "100%",
              "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
                outline: "none !important",
              },
            }}
          />
        )}
      </Box>
      <MostCommonWords />
      <AllKeywordsTable />
    </Box>
  )
}

export default CategoriesView
