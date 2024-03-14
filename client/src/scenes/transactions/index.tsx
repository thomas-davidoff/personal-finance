import {
  Box,
  Select,
  MenuItem,
  SelectChangeEvent,
  Button,
} from '@mui/material'
import {
  useBulkUpdateTransactionsMutation,
  useGetCategoriesQuery,
  useGetMonthlyTransactionsQuery,
} from '@/state/api'
import {GetAllCategoriesResponse, TransactionFieldChange} from '@/state/types'
import {Snackbar} from '@mui/material'
import {useState, useEffect} from 'react'
import Alert, {AlertProps} from '@mui/material/Alert'
import {
  GridColDef,
  GridRowId,
  GridApi,
  GridRowsProp,
  GridRowModesModel,
  GridRowModes,
  GridToolbarContainer,
  GridRowModel,
} from '@mui/x-data-grid'
import StyledDataGrid from '@/components/StyledDataGrid'
import DashboardBox from '@/components/DashboardBox'
import ControlPanel from '@/scenes/transactions/ControlPanel'
import {BulkUpdatePayload} from '@/state/types'

const Transactions = () => {
  const [selectedMonth, setSelectedMonth] = useState('')
  const [selectedYear, setSelectedYear] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedTransactionType, setSelectedTransactionType] = useState('')
  const [selectedRowId, setSelectedRowId] = useState<GridRowId>('')
  const [rows, setRows] = useState<GridRowsProp>([])
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({})

  type FieldChange = {
    oldValue: string
    newValue: string
  }
  type StagedChanges = {
    [key: string]: {
      [field: string]: FieldChange
    }
  }
  const [stagedChanges, setStagedChanges] = useState<StagedChanges>({})

  useEffect(() => {
    console.log(`staged changes: ${JSON.stringify(stagedChanges)}`)
  }, [stagedChanges])

  const handleProcessRowUpdate = (
    newRow: GridRowModel,
    oldRow: GridRowModel,
  ) => {
    console.log(`old row: ${JSON.stringify(oldRow)}`)
    console.log(`new row: ${JSON.stringify(newRow)}`)
    // Stage the changes
    const fieldsChanged = Object.keys(newRow).filter(
      key => newRow[key] !== oldRow[key],
    )

    // Initialize an object to accumulate changes for the current row
    const changesForCurrentRow: {[field: string]: FieldChange} = {}

    // Iterate over changed fields and accumulate changes
    for (const field of fieldsChanged) {
      changesForCurrentRow[field] = {
        oldValue: oldRow[field],
        newValue: newRow[field],
      }
    }
    if (fieldsChanged.length > 0) {
      setHasUnsavedChanges(true)
      setStagedChanges(prev => ({
        ...prev,
        [newRow.id]: {
          ...prev[newRow.id],
          ...changesForCurrentRow,
        },
      }))
    }
    return newRow
  }

  const columns: GridColDef[] = [
    {field: 'id', headerName: 'ID', width: 75},
    {
      field: 'date',
      headerName: 'Date',
      type: 'date',
      width: 125,
      renderCell: params => {
        // Format the Date object to a readable string
        return params.value.toLocaleDateString('default', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      },
    },
    {
      field: 'description',
      headerName: 'Description',
      width: 600,
      editable: true,
    },
    {field: 'account', headerName: 'Account', width: 125},
    {field: 'amount', headerName: 'Amount', width: 150},
    {
      field: 'category',
      headerName: 'Category',
      width: 150,
      editable: true,
      renderEditCell: params => (
        <FieldEditComponent
          {...params}
          categories={categoriesData}
          setHasUnsavedChanges={setHasUnsavedChanges}
        />
      ),
    },
    {field: 'type', headerName: 'Type', width: 150},
  ]
  interface FieldEditComponentProps {
    id: GridRowId
    value?: string // Adjust the type based on what 'value' is expected to be
    field: string
    api: GridApi // Import GridApiCommunity from '@mui/x-data-grid'
    categories: GetAllCategoriesResponse[] // Adjust the type based on your categories data structure
    setHasUnsavedChanges: React.Dispatch<React.SetStateAction<boolean>>
  }
  const {data: categoriesData = []} = useGetCategoriesQuery()
  const FieldEditComponent = ({
    id,
    value,
    field,
    api,
    categories,
    setHasUnsavedChanges,
  }: FieldEditComponentProps) => {
    const handleChange = (event: SelectChangeEvent<string>) => {
      const newValue = event.target.value as string
      setHasUnsavedChanges(true)
      api.setEditCellValue({id, field, value: newValue}, event)
    }
    return (
      <Select value={value} onChange={handleChange} size="small" fullWidth>
        {categories.map(category => (
          <MenuItem key={category.id} value={category.name}>
            {category.name}
          </MenuItem>
        ))}
      </Select>
    )
  }

  const handleCloseSnackbar = () => setSnackbar(null)
  const [snackbar, setSnackbar] = useState<Pick<
    AlertProps,
    'children' | 'severity'
  > | null>(null)

  const {data: transactionsData} = useGetMonthlyTransactionsQuery({
    month: selectedMonth,
    year: selectedYear,
    category: selectedCategory,
    transactionType: selectedTransactionType,
  })

  useEffect(() => {
    if (transactionsData) {
      const mappedRows: GridRowsProp = transactionsData.map(transaction => ({
        id: transaction.id,
        description: transaction.description,
        date: new Date(transaction.date),
        account: transaction.account,
        amount: transaction.amount,
        category: transaction.category,
        type: transaction.type,
      }))
      setRows(mappedRows)
    }
  }, [transactionsData])

  const constructBulkUpdatePayload = (
    stagedChanges: StagedChanges,
  ): BulkUpdatePayload => {
    console.log('Constructing payload')
    return Object.entries(stagedChanges).map(([transactionId, changes]) => {
      const changeEntries = Object.entries(changes)

      const changesObject = changeEntries.reduce(
        (acc: TransactionFieldChange, [fieldName, {newValue}]) => {
          acc[fieldName] = newValue
          return acc
        },
        {},
      )

      return {
        transactionId,
        changes: changesObject,
      }
    })
  }
  const [bulkUpdateTransactions, {isLoading, isError, isSuccess}] =
    useBulkUpdateTransactionsMutation()

  const handleSaveChanges = () => {
    console.log(`saving these changes!!!\n${JSON.stringify(stagedChanges)}`)
    const bulkUpdatePayload = constructBulkUpdatePayload(stagedChanges)
    console.log(bulkUpdatePayload)

    // Trigger the mutation
    bulkUpdateTransactions(bulkUpdatePayload).unwrap()

    // Example conditional rendering or actions based on the mutation state
    if (isLoading) {
      // Show a loading indicator
    }

    if (isError) {
      setSnackbar({
        severity: 'error',
        children: 'data not saved successfully.'
      })
    }

    if (isSuccess) {
      // Show a success message
      setSnackbar({
        severity: 'success',
        children: 'Changes saved successfully.',
      })
      setHasUnsavedChanges(false)
      setStagedChanges({}) // Reset unsaved changes flag upon success
    }
  }

  const handleDiscardChanges = () => {
    setStagedChanges({})
    setHasUnsavedChanges(false)
  }

  return (
    <Box width="100%" height="100%">
      <DashboardBox sx={{mb: 2, mt: 2, padding: 2}}>
      <ControlPanel
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        selectedTransactionType={selectedTransactionType}
        setSelectedTransactionType={setSelectedTransactionType}
        categoriesData={categoriesData}
      />
      </DashboardBox>
      <DashboardBox display={'flex'} minHeight={250}>
        <div style={{flexGrow: 1}}>
          {transactionsData && (
            <StyledDataGrid
              rows={rows}
              columns={columns}
              editMode="row"
              rowModesModel={rowModesModel}
              processRowUpdate={handleProcessRowUpdate}
              onRowModesModelChange={model => setRowModesModel(model)}
              onRowSelectionModelChange={newSelectionModel => {
                setSelectedRowId(newSelectionModel[0])
              }}
              slots={{
                toolbar: GridToolbar,
              }}
              slotProps={{
                toolbar: {
                  selectedRowId,
                  hasUnsavedChanges,
                  handleSaveChanges,
                  setRowModesModel,
                  handleDiscardChanges,
                },
              }}
            />
          )}
        </div>
      </DashboardBox>
      {!!snackbar && (
        <Snackbar
          open
          anchorOrigin={{vertical: 'top', horizontal: 'center'}}
          onClose={handleCloseSnackbar}
          autoHideDuration={6000}>
          <Alert {...snackbar} onClose={handleCloseSnackbar} />
        </Snackbar>
      )}
    </Box>
  )
}

export default Transactions

interface GridToolbarProps {
  selectedRowId: GridRowId
  // setSelectedRowId: (rowIds: GridRowId) => void;
  hasUnsavedChanges: boolean
  handleSaveChanges: () => void
  rowModesModel: GridRowModesModel
  setRowModesModel: React.Dispatch<React.SetStateAction<GridRowModesModel>>
  handleDiscardChanges: () => void
}

const GridToolbar = ({
  selectedRowId,
  hasUnsavedChanges,
  handleSaveChanges,
  setRowModesModel,
  handleDiscardChanges,
}: GridToolbarProps) => {
  const handleEdit = () => {
    setRowModesModel(oldModel => ({
      ...oldModel,
      [selectedRowId]: {mode: GridRowModes.Edit},
    }))
  }
  return (
    <GridToolbarContainer sx={{m: 2}}>
      <Button
        variant="contained"
        color="primary"
        disabled={!selectedRowId}
        onClick={handleEdit}>
        Edit
      </Button>
      <Button
        variant="contained"
        color="primary"
        disabled={!hasUnsavedChanges}
        onClick={handleSaveChanges}>
        Save
      </Button>
      <Button
        variant="contained"
        color="primary"
        disabled={!hasUnsavedChanges}
        onClick={handleDiscardChanges}>
        Discard Changes
      </Button>
    </GridToolbarContainer>
  )
}
