import BoxHeader from "@/components/BoxHeader"
import DashboardBox from "@/components/DashboardBox"
// import { useGetMonthlyKPIsQuery } from "@/state/api"
import { useTheme } from "@mui/material"
import { useMemo } from "react"
import {
  ResponsiveContainer,
  CartesianGrid,
  AreaChart,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Box, Select, MenuItem } from "@mui/material"
import FormHelperText from "@mui/material/FormHelperText"
import InputLabel from "@mui/material/InputLabel"
import Breakdown from "@/scenes/dashboard/Breakdown"
import FormControl from "@mui/material/FormControl"
import NumberSummary from "@/components/NumberSummary"

interface Props {
  selectedMonth: string
  setSelectedMonth: React.Dispatch<React.SetStateAction<string>>
  selectedYear: string
  setSelectedYear: React.Dispatch<React.SetStateAction<string>>
}

const Row1 = ({
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
}: Props) => {
  const { palette } = useTheme()

  const data = [{}]

  const byCategory = useMemo(() => {
    const filteredAndMappedCategories = data?.aggregate_by_category
      ?.filter((category) => category.total < 0) // Keep only categories with total < 0
      .map((category) => ({
        name: category.category,
        spending: category.total * -1, // Negate the total to make it positive
      }))

    // Ensure we have categories to display, otherwise return null to avoid rendering an empty chart
    return filteredAndMappedCategories
  }, [data])

  const cumulativeSpending = data && data.cumulative_spending

  const byTransactionType = data?.aggregate_by_transaction_type?.reduce(
    (acc: { [type: string]: number }, { transaction_type, total }) => {
      acc[transaction_type] = total
      return acc
    },
    {}
  )

  const COLORS = [
    palette.primary[100],
    palette.primary[200],
    palette.primary[300],
    palette.primary[400],
    palette.primary[500],
    palette.primary[600],
    palette.primary[700],
    palette.primary[800],
    palette.primary[900],
  ]

  const months = [
    { label: "January", value: "01" },
    { label: "February", value: "02" },
    { label: "March", value: "03" },
    { label: "April", value: "04" },
    { label: "May", value: "05" },
    { label: "June", value: "06" },
    { label: "July", value: "07" },
    { label: "August", value: "08" },
    { label: "September", value: "09" },
    { label: "October", value: "10" },
    { label: "November", value: "11" },
    { label: "December", value: "12" },
  ]

  // Assuming you want a range of years from 2020 to the current year
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: currentYear - 2020 + 1 }, (_, i) => ({
    label: `${i + 2020}`,
    value: i + 2020,
  }))

  const breakdown = data?.aggregate_by_category

  return (
    <>
      <DashboardBox
        gridArea="control"
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="select-month-label">Month</InputLabel>
          <Select
            value={selectedMonth}
            label="Month"
            onChange={(e) => setSelectedMonth(e.target.value)}
            labelId="select-month-label"
            fullWidth
          >
            {months.map((month) => (
              <MenuItem key={month.value} value={month.value}>
                {month.label}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>Select a month</FormHelperText>
        </FormControl>
        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="select-year-label">Year</InputLabel>
          <Select
            value={selectedYear}
            labelId="select-year-label"
            onChange={(e) => setSelectedYear(e.target.value)}
            label="Year"
            fullWidth
          >
            {years.map((year) => (
              <MenuItem key={year.value} value={year.value}>
                {year.label}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>Select a year</FormHelperText>
        </FormControl>
      </DashboardBox>
      <DashboardBox gridArea="cumulSpending">
        <BoxHeader
          title="Cumulative Spending"
          subtitle="Last month vs previous month"
          sideText=""
        />
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            width={500}
            height={400}
            data={cumulativeSpending}
            margin={{
              top: 15,
              right: 25,
              left: -10,
              bottom: 60,
            }}
          >
            <defs>
              <linearGradient id="colorLastMonth" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={palette.secondary[300]}
                  stopOpacity={0.5}
                />
                <stop
                  offset="100%"
                  stopColor={palette.secondary[300]}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke={palette.grey[800]} />
            <XAxis
              dataKey="day"
              tickLine={false}
              style={{ fontSize: "10px" }}
            />
            <YAxis
              type="number"
              tickLine={false}
              axisLine={{ strokeWidth: "0" }}
              style={{ fontSize: "10px" }}
            />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="cumulative_spending"
              dot={true}
              stroke={palette.secondary.main}
              fillOpacity={1}
              fill="url(#colorLastMonth)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </DashboardBox>
      <DashboardBox gridArea="categoryPie">
        <BoxHeader
          title="[PFD] Expenses by Category"
          subtitle="chart displaying overall spending by category"
          sideText=""
        />
        <ResponsiveContainer width="100%" height="100%">
          <PieChart
            width={400}
            height={400}
            margin={{
              top: 17,
              right: 15,
              left: -5,
              bottom: 58,
            }}
          >
            <Pie
              dataKey="spending"
              isAnimationActive={false}
              data={byCategory}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill={palette.primary[300]}
              label
            >
              {byCategory &&
                byCategory.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </DashboardBox>
      <DashboardBox gridArea="recentTransactions">
        recent transactions
      </DashboardBox>
      <Box
        gridArea="spendingSummary"
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <NumberSummary
          number={byTransactionType?.expense}
          subtitle="total expenses"
        />
        <NumberSummary
          number={byTransactionType?.income}
          subtitle="total income"
        />
        <NumberSummary
          number={byTransactionType?.other}
          subtitle="total other"
        />
      </Box>
      <DashboardBox gridArea="breakdown">
        <Breakdown
          aggregateByTransactionCategory={
            data ? data.aggregate_by_category : []
          }
          aggregateByTransactionType={
            data ? data.aggregate_by_transaction_type : []
          }
        ></Breakdown>
      </DashboardBox>
    </>
  )
}

export default Row1
