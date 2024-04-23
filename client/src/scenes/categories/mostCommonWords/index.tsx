import {
  useGetCommonDescriptionWordsQuery,
  useCategorizeTransactionsMutation,
} from "@/state/api"
import DashboardBox from "@/components/DashboardBox"
import CategoriesForm from "@/scenes/categories/mostCommonWords/Control" // adjust the path as needed
import {
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
} from "@mui/material"
import NestedRow from "@/scenes/categories/mostCommonWords/Row"
import { useState, useEffect } from "react"

const MostCommonWords = () => {
  const [queryParameters, setQueryParameters] = useState({
    minConsecutive: 2,
    minWordLength: 4,
    ignoredWords: "",
    numberToReturn: 10,
  })

  const [categorizeTransactions, { isSuccess }] =
    useCategorizeTransactionsMutation()
  const handleCategorizeClick = async () => {
    try {
      const response = await categorizeTransactions().unwrap()
      alert(
        `Successfully recategorized. Updated ${response.total_updated} transactions with ${response.warnings.length} warnings.`
      )
    } catch (err) {
      console.error("Failed:", err)
    }
  }

  const { data: commonWords, refetch } =
    useGetCommonDescriptionWordsQuery(queryParameters)

  useEffect(() => {
    if (isSuccess) {
      refetch()
      console.log(commonWords)
    }
  }, [isSuccess, refetch])

  return (
    <Box
      width="100%"
      height="100%"
      gap="1.5rem"
      sx={{ display: "flex", flexDirection: "row", border: "1px solid blue" }}
    >
      <DashboardBox width="25%">
        <Button onClick={handleCategorizeClick}>Categorize Transactions</Button>
        <CategoriesForm
          queryParams={queryParameters}
          setQueryParams={setQueryParameters}
        />
      </DashboardBox>
      <DashboardBox>
        <TableContainer>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Phrase</TableCell>
                <TableCell>Count</TableCell>
                <TableCell>Avg. Amount</TableCell>
                <TableCell>Total Amount</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {commonWords?.map((row) => (
                <NestedRow key={row.phrase} row={row} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DashboardBox>
    </Box>
  )
}

export default MostCommonWords
