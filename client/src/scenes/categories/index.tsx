import { Box } from "@mui/material"
import { useGetCategoriesQuery } from "@/state/api"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"

const CategoriesView = () => {
  const { data } = useGetCategoriesQuery()
  console.log(data)
  return (
    <Box width="100%" height="100%" display="grid" gap="1.5rem">
      <TableContainer>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Number of Transactions</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Subtype</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.description}</TableCell>
                <TableCell>{row.num_transactions}</TableCell>
                <TableCell>{row.transaction_type}</TableCell>
                <TableCell>{row.transaction_subtype}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default CategoriesView
