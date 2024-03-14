import {Box, Select, MenuItem} from '@mui/material'
import FormHelperText from '@mui/material/FormHelperText'
import InputLabel from '@mui/material/InputLabel'

import FormControl from '@mui/material/FormControl'
import {GetAllCategoriesResponse} from '@/state/types'
import {Button} from '@mui/material'

interface Props {
  selectedMonth: string
  setSelectedMonth: React.Dispatch<React.SetStateAction<string>>
  selectedYear: string
  setSelectedYear: React.Dispatch<React.SetStateAction<string>>
  selectedCategory: string
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>
  categoriesData: GetAllCategoriesResponse[]
  selectedTransactionType: string
  setSelectedTransactionType: React.Dispatch<React.SetStateAction<string>>
}
const ControlPanel = ({
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
  selectedCategory,
  setSelectedCategory,
  categoriesData,
  selectedTransactionType,
  setSelectedTransactionType,
}: Props) => {
  const months = [
    {label: 'January', value: '01'},
    {label: 'February', value: '02'},
    {label: 'March', value: '03'},
    {label: 'April', value: '04'},
    {label: 'May', value: '05'},
    {label: 'June', value: '06'},
    {label: 'July', value: '07'},
    {label: 'August', value: '08'},
    {label: 'September', value: '09'},
    {label: 'October', value: '10'},
    {label: 'November', value: '11'},
    {label: 'December', value: '12'},
  ]

  // Assuming you want a range of years from 2020 to the current year
  const currentYear = new Date().getFullYear()
  const years = Array.from({length: currentYear - 2020 + 1}, (_, i) => ({
    label: `${i + 2020}`,
    value: i + 2020,
  }))

  const transactionTypes = [
    {label: 'Income', value: '01'},
    {label: 'Expense', value: '02'},
  ]

  const clearFilters = () => {
    setSelectedMonth('')
    setSelectedYear('')
    setSelectedCategory('')
    setSelectedTransactionType('')
  }

  return (
    <Box>
      <FormControl sx={{m: 1, minWidth: 120}}>
        <InputLabel id="select-month-label">Month</InputLabel>
        <Select
          value={selectedMonth}
          label="Month"
          onChange={e => setSelectedMonth(e.target.value)}
          labelId="select-month-label"
          fullWidth>
          {months.map(month => (
            <MenuItem key={month.value} value={month.value}>
              {month.label}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>Select a month</FormHelperText>
      </FormControl>
      <FormControl sx={{m: 1, minWidth: 120}}>
        <InputLabel id="select-year-label">Year</InputLabel>
        <Select
          value={selectedYear}
          labelId="select-year-label"
          onChange={e => setSelectedYear(e.target.value)}
          label="Year"
          fullWidth>
          {years.map(year => (
            <MenuItem key={year.value} value={year.value}>
              {year.label}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>Select a year</FormHelperText>
      </FormControl>
      <FormControl sx={{m: 1, minWidth: 120}}>
        <InputLabel id="select-category-label">Category</InputLabel>
        <Select
          value={selectedCategory}
          labelId="select-category-label"
          onChange={e => setSelectedCategory(e.target.value)}
          label="Category"
          fullWidth>
          {categoriesData.map(category => (
            <MenuItem key={category.id} value={category.name}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>Select a category</FormHelperText>
      </FormControl>
      <FormControl sx={{m: 1, minWidth: 120}}>
        <InputLabel id="select-transaction-type-label">
          Transaction Type
        </InputLabel>
        <Select
          value={selectedTransactionType}
          labelId="select-transaction-type-label"
          onChange={e => setSelectedTransactionType(e.target.value)}
          label="Transaction Type"
          fullWidth>
          {transactionTypes.map(transactionType => (
            <MenuItem key={transactionType.value} value={transactionType.label}>
              {transactionType.label}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>Select a transaction type</FormHelperText>
      </FormControl>
      {/* Clear Filters Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={clearFilters}
        sx={{mt: 2}}>
        Clear Filters
      </Button>
    </Box>
  )
}

export default ControlPanel
