import { useGetCategoriesQuery, useDeleteCategoryMutation } from "@/state/api"
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
import UpdateCategoryForm2 from "@/scenes/categories/UpdateCat2"
import CategoryColorPill from "@/components/CategoryColorPill"

import IconButton from "@mui/material/IconButton"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import MoreVertIcon from "@mui/icons-material/MoreVert"

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
      renderCell: (params) => {
        const rowId = params.row.id
        const [anchorEl, setAnchorEl] = useState<null | EventTarget>(null)
        const open = Boolean(anchorEl)

        useEffect(() => {
          if (open) {
            setSelectedRowIds([rowId])
          }
        }, [open])

        const [modalOpen, setModalOpen] = useState(false)

        const handleClick = (event: Event) => {
          event.stopPropagation()
          setAnchorEl(event.currentTarget)
        }

        const handleClose = () => {
          setAnchorEl(null)
        }

        const handleOpenModal = () => {
          handleClose() // Close the menu
          setTimeout(() => {
            // Delay the modal opening to ensure menu closes smoothly
            setModalOpen(true)
          }, 100)
        }

        const [deleteCategory] = useDeleteCategoryMutation()

        const handleDeleteCategory = async () => {
          handleClose()
          try {
            const response = await deleteCategory(
              Number(selectedRowIds[0])
            ).unwrap()
            alert(response.message)
          } catch (error: unknown) {
            if (typeof error === "string") {
              error.toUpperCase()
            } else if (error instanceof Error || error instanceof Object) {
              if ("message" in error) {
                alert(`Category could not be deleted: ${error.message}`)
              }
            } else {
              alert("There was a problem deleting the category.")
              console.error(error)
            }
          }
        }

        return (
          <div>
            <IconButton
              aria-label="more"
              aria-controls="long-menu"
              aria-haspopup="true"
              onClick={handleClick}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              id="long-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
            >
              <MenuItem
                onClick={handleOpenModal}
                disabled={isNaN(Number(selectedRowIds[0]))}
              >
                Update
              </MenuItem>
              <MenuItem
                disabled={isNaN(Number(selectedRowIds[0]))}
                onClick={handleDeleteCategory}
              >
                Delete
              </MenuItem>
            </Menu>
            <UpdateCategoryForm2
              open={modalOpen}
              setOpen={setModalOpen}
              categoryId={selectedRowIds}
            />
          </div>
        )
      },
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
