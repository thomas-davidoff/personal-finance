import { useGetKeywordsQuery } from "@/state/api"
import { useState, useEffect } from "react"
import {
  GridColDef,
  GridRowId,
  GridRowsProp,
  GridRowModesModel,
} from "@mui/x-data-grid"
import StyledDataGrid from "@/components/StyledDataGrid"
import DashboardBox from "@/components/DashboardBox"
import DeleteKeywordButton from "./deleteKeywordButton"

const AllKeywordsTable = () => {
  const { data } = useGetKeywordsQuery()
  const [selectedRowIds, setSelectedRowIds] = useState<Array<GridRowId>>([])
  const [rows, setRows] = useState<GridRowsProp>([])
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({})

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 75 },
    {
      field: "keyword",
      headerName: "Keyword",
      width: 600,
    },
    { field: "description", headerName: "Description", width: 125 },
    {
      field: "category",
      headerName: "Category",
      width: 150,
    },
  ]

  useEffect(() => {
    if (data) {
      const mappedRows: GridRowsProp = data.map((datum) => ({
        id: datum.id,
        keyword: datum.keyword,
        description: datum.description,
        category: datum.category?.name,
      }))
      setRows(mappedRows)
    }
  }, [data])

  return (
    <DashboardBox>
      <DeleteKeywordButton keywordId={selectedRowIds} />
      {data && (
        <StyledDataGrid
          rows={rows}
          columns={columns}
          rowModesModel={rowModesModel}
          onRowModesModelChange={(model) => setRowModesModel(model)}
          onRowSelectionModelChange={(newSelectionModel) => {
            setSelectedRowIds(newSelectionModel)
          }}
        />
      )}
    </DashboardBox>
  )
}

export default AllKeywordsTable
