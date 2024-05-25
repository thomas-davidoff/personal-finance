import { Box } from "@mui/material"
import { useGetTransactionsQuery } from "@/state/api"
import TransactionForm from "@/scenes/transactions/CreateTransactionForm"
import UpdateTransactionForm from "@/scenes/transactions/UpdateTransactionForm"
import { useState, useEffect } from "react"
import {
  GridColDef,
  GridRowId,
  GridRowsProp,
  GridRowModesModel,
} from "@mui/x-data-grid"
import StyledDataGrid from "@/components/StyledDataGrid"
import DashboardBox from "@/components/DashboardBox"
import DeleteMultipleTransactions from "@/scenes/transactions/DeleteTransactionButton"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import CategoryColorPill from "@/components/CategoryColorPill"

dayjs.extend(utc)

const Transactions = () => {
  const [selectedRowIds, setSelectedRowIds] = useState<Array<GridRowId>>([])
  const [rows, setRows] = useState<GridRowsProp>([])
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({})

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 75 },
    {
      field: "date",
      headerName: "Date",
      type: "date",
      width: 125,
      renderCell: (params) => {
        return dayjs.utc(params.value).format("MMM DD, YYYY")
      },
    },
    {
      field: "description",
      headerName: "Description",
      width: 600,
    },
    { field: "account", headerName: "Account", width: 125 },
    { field: "amount", headerName: "Amount", width: 150 },
    {
      field: "category",
      headerName: "Category",
      width: 150,
      renderCell: (params) => {
        return (
          <CategoryColorPill
            label={params.value.name}
            colorKey={params.value.color}
          />
        )
      },
    },
  ]

  const { data: transactionsData } = useGetTransactionsQuery({
    start: "1970-01-01",
    end: "2038-01-01",
  })

  useEffect(() => {
    if (transactionsData) {
      const mappedRows: GridRowsProp = transactionsData.map((transaction) => ({
        id: transaction.id,
        description: transaction.description,
        date: new Date(transaction.date),
        account: transaction.account?.name,
        amount: transaction.amount,
        category: transaction.category,
      }))
      setRows(mappedRows)
    }
  }, [transactionsData])

  return (
    <Box width="100%" height="100%">
      <DeleteMultipleTransactions transactionId={selectedRowIds} />
      <DashboardBox>
        <TransactionForm />
        <UpdateTransactionForm transactionId={selectedRowIds} />
      </DashboardBox>
      <DashboardBox display={"flex"} minHeight={250}>
        <div style={{ flexGrow: 1 }}>
          {transactionsData && (
            <StyledDataGrid
              rows={rows}
              columns={columns}
              // editMode="row"
              rowModesModel={rowModesModel}
              onRowModesModelChange={(model) => setRowModesModel(model)}
              onRowSelectionModelChange={(newSelectionModel) => {
                setSelectedRowIds(newSelectionModel)
              }}
            />
          )}
        </div>
      </DashboardBox>
    </Box>
  )
}

export default Transactions
