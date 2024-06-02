import { Box } from "@mui/material"
import { useGetTransactionsQuery } from "@/state/api"
import { useState, useEffect } from "react"
import { GridColDef, GridRowsProp, GridRowModesModel } from "@mui/x-data-grid"
import StyledDataGrid from "@/components/StyledDataGrid"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import CategoryColorPill from "@/components/CategoryColorPill"
import RowEdit from "@/components/RowEdit"
import { useHandleDeleteTransaction } from "@/hooks/useHandleDelete"
import CreateTransactionButton from "@/scenes/transactions/createTransactionButton"
import TransactionModal from "@/scenes/transactions/transactionModal"

dayjs.extend(utc)

const Transactions = () => {
  const [rows, setRows] = useState<GridRowsProp>([])
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({})

  const handleDeleteTransaction = useHandleDeleteTransaction()

  const columns: GridColDef[] = [
    {
      field: "edit",
      headerName: "Edit",
      width: 50,
      renderCell: (params) => (
        <RowEdit
          rowId={params.row.id}
          UpdateModal={TransactionModal}
          handleDelete={handleDeleteTransaction}
        />
      ),
      sortable: false,
    },
    { field: "id", headerName: "ID", flex: 1 },
    {
      field: "date",
      headerName: "Date",
      type: "date",
      flex: 1,
      renderCell: (params) => {
        return dayjs.utc(params.value).format("MMM DD, YYYY")
      },
    },
    {
      field: "description",
      headerName: "Description",
      flex: 5,
    },
    { field: "account", headerName: "Account", width: 125 },
    { field: "amount", headerName: "Amount", width: 150 },
    {
      field: "category",
      headerName: "Category",
      flex: 1,
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
      <Box>
        {/* TODO: Create search bar functionality for transactions */}
        <CreateTransactionButton />
      </Box>
      <Box display={"flex"} minHeight={250}>
        <div style={{ flexGrow: 1 }}>
          {transactionsData && (
            <StyledDataGrid
              rows={rows}
              columns={columns}
              rowModesModel={rowModesModel}
              onRowModesModelChange={(model) => setRowModesModel(model)}
            />
          )}
        </div>
      </Box>
    </Box>
  )
}

export default Transactions
