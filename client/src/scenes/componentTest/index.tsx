import { Box } from "@mui/material"
import AggregatedTransactionsByCategory from "@/scenes/componentTest/AggregatedTransactionsByCategory"
import AccountRunningBalanceChart from "./AccountRunningBalance"
import { FormControl, Select } from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers"
import dayjs, { Dayjs } from "dayjs"
import { useState } from "react"

function TestPage() {
  const [startDate, setStartDate] = useState(dayjs().subtract(3, "months"))
  const [endDate, setEndDate] = useState(dayjs())
  return (
    <Box height="100%" width="100%">
      <FormControl fullWidth>
        <DatePicker
          label="Start Date"
          value={startDate}
          onChange={(newValue) => setStartDate(newValue ? newValue : dayjs())}
        />
      </FormControl>
      <FormControl fullWidth>
        <DatePicker
          label="End Date"
          value={endDate}
          onChange={(newValue) => setEndDate(newValue ? newValue : dayjs())}
        />
      </FormControl>
      <AccountRunningBalanceChart
        startDate={startDate.format("YYYY-MM-DD")}
        endDate={endDate.format("YYYY-MM-DD")}
      />
      <AggregatedTransactionsByCategory
        startDate={startDate.format("YYYY-MM-DD")}
        endDate={endDate.format("YYYY-MM-DD")}
      />
    </Box>
  )
}

export default TestPage
