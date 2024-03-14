import BoxHeader from '@/components/BoxHeader'
import DashboardBox from '@/components/DashboardBox'
import {useGetMonthlyKPIsQuery} from '@/state/api'
import {useTheme} from '@mui/material'
import {useMemo} from 'react'
import {
  ResponsiveContainer,
  CartesianGrid,
  AreaChart,
  BarChart,
  Bar,
  LineChart,
  XAxis,
  YAxis,
  Legend,
  Line,
  Tooltip,
  Area,
  PieChart,
  Pie,
  Cell,
  ReferenceLine,
} from 'recharts'
import {Box, Select, MenuItem} from '@mui/material'
import FormHelperText from '@mui/material/FormHelperText'
import InputLabel from '@mui/material/InputLabel'

import FormControl from '@mui/material/FormControl'

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
  const {palette} = useTheme()
  const {data} = useGetMonthlyKPIsQuery({
    month: selectedMonth, // selectedMonth
    year: selectedYear, // selectedYear
  })

  const byCategory = useMemo(() => {
    const filteredAndMappedCategories = data?.aggregate_by_category
      ?.filter(category => category.total < 0) // Keep only categories with total < 0
      .map(category => ({
        name: category.category,
        spending: category.total * -1, // Negate the total to make it positive
      }))

    // Ensure we have categories to display, otherwise return null to avoid rendering an empty chart
    return filteredAndMappedCategories
  }, [data])

  const cumulativeSpending = data && data.cumulative_spending

  const byTransactionType = data?.aggregate_by_transaction_type?.reduce(
    (acc: {[type: string]: number}, {transaction_type, total}) => {
      acc[transaction_type] = total
      return acc
    },
    {},
  )

  // const monthlySpending = useMemo(() => {
  //   return (
  //     data &&
  //     data[0].monthly_spending.map(month => {
  //       return {
  //         name: month.month_year,
  //         spending: month.total_expenses,
  //       }
  //     })
  //   )
  // }, [data])

  // const cumulativeSpending = useMemo(() => {
  //   const cumul = data && data[0].cumulative
  //   console.log('cumul: ', cumul)

  //   interface CumulativeSpendingIndex {
  //     [date: string]: number
  //   }

  //   if (!cumul) {
  //     return cumul
  //   }

  //   console.log(cumul.last_month, cumul.prev_month)

  //   // Step 1: Index the data by 'date'
  //   const indexLastMonth = cumul.last_month.reduce((acc, item) => {
  //     acc[item.date] = item.cumulative_spending
  //     return acc
  //   }, {} as CumulativeSpendingIndex)

  //   const indexPreviousMonth = cumul.prev_month.reduce((acc, item) => {
  //     acc[item.date] = item.cumulative_spending
  //     return acc
  //   }, {} as CumulativeSpendingIndex)

  //   console.log('index last month: ', indexLastMonth)

  //   // Step 2: Iterate and combine
  //   const combinedData = Object.entries(indexLastMonth).map(
  //     ([date, lastMonthSpending]) => ({
  //       name: date,
  //       last_month: lastMonthSpending,
  //       prev_month: indexPreviousMonth[date] || 0, // Use 0 if the date is not found in previous_month
  //     }),
  //   )

  //   console.log(combinedData)

  //   // Step 3: Sort the combined data by date
  //   combinedData.sort((a, b) => a.name.localeCompare(b.name))

  //   return combinedData
  // }, [data])

  // const monthlyCategories = useMemo(() => {
  //   return (
  //     data &&
  //     data[0].category.last_month.map(category => {
  //       return {
  //         name: category.category,
  //         spending: category.total_expenses,
  //       }
  //     })
  //   )
  // }, [data])

  // const yearlyCategories = useMemo(() => {
  //   return (
  //     data &&
  //     data[0].category.year.map(({category, total_expenses}) => {
  //       return {name: category, value: total_expenses}
  //     })
  //   )
  // }, [data])

  // console.log('yearly: ', yearlyCategories)

  // const income = useMemo(() => {
  //   return (
  //     data &&
  //     data[0].monthlyData.map(({month, income}) => {
  //       return {
  //         name: month.substring(0, 3),
  //         income: income,
  //       }
  //     })
  //   )
  // }, [data])

  // const incomeExpenses = useMemo(() => {
  //   return (
  //     data &&
  //     data[0].monthlyData.map(({month, income, expenses}) => {
  //       return {
  //         name: month.substring(0, 3),
  //         income: income,
  //         expenses: expenses,
  //       }
  //     })
  //   )
  // }, [data])

  // const incomeProfit = useMemo(() => {
  //   return (
  //     data &&
  //     data[0].monthlyData.map(({month, income, expenses}) => {
  //       return {
  //         name: month.substring(0, 3),
  //         income,
  //         profit: income - expenses,
  //       }
  //     })
  //   )
  // }, [data])

  // const expensesByCategory = useMemo(() => {
  //   return (
  //     data &&
  //     Object.entries(data[0].expensesByCategory).map(([key, value]) => {
  //       return {name: key, value: parseInt(value.replace('$', ''))}
  //     })
  //   )
  // }, [data])

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

  return (
    <>
      <DashboardBox gridArea="a">
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
      </DashboardBox>
      <DashboardBox gridArea="b">
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
            }}>
            <defs>
              <linearGradient id="colorLastMonth" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={palette.primary[300]}
                  stopOpacity={0.5}
                />
                <stop
                  offset="95%"
                  stopColor={palette.primary[300]}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke={palette.grey[800]} />
            <XAxis dataKey="day" tickLine={false} style={{fontSize: '10px'}} />
            <YAxis
              type="number"
              tickLine={false}
              axisLine={{strokeWidth: '0'}}
              style={{fontSize: '10px'}}
            />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="cumulative_spending"
              dot={true}
              stroke={palette.primary.main}
              fillOpacity={1}
              fill="url(#colorLastMonth)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </DashboardBox>
      <DashboardBox gridArea="c">
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
            }}>
            <Pie
              dataKey="spending"
              isAnimationActive={false}
              data={byCategory}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill={palette.primary[300]}
              label>
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
      <DashboardBox gridArea="d">d</DashboardBox>
      <DashboardBox gridArea="e">e</DashboardBox>
      <DashboardBox gridArea="f" padding={2}>
        {/* <BoxHeader
          title="Total Monthly Spending"
          subtitle="Last 12 months"
          sideText=""
        /> */}
        <ResponsiveContainer width="50%" height="100%">
          {/* <BarChart
            width={500}
            height={300}
            data={byTransactionType}
            margin={{
              top: 17,
              right: 15,
              left: -5,
              bottom: 58,
            }}>
            <defs>
              <linearGradient id="colorSpending" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={palette.primary[300]}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={palette.primary[300]}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke={palette.grey[800]} />
            <XAxis
              dataKey="transaction_type"
              axisLine={false}
              tickLine={false}
              style={{fontSize: '10px'}}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              style={{fontSize: '10px'}}
            />
            <Tooltip />
            <Bar dataKey="total" fill="url(#colorSpending)" />
          </BarChart> */}
          <BarChart
            // width={500}
            // height={300}
            data={[byTransactionType]}
            stackOffset="sign"
            maxBarSize={50}
            >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            {/* <Legend /> */}
            {/* <ReferenceLine y={0} stroke="#000" /> */}
            <Bar dataKey="expense" fill={palette.secondary[500]} stackId="stack" />
            <Bar dataKey="income" fill={palette.primary[500]} stackId="stack" />
            <Bar dataKey="other" fill={palette.grey[500]} stackId="stack" />
          </BarChart>
        </ResponsiveContainer>
      </DashboardBox>
      <DashboardBox gridArea="g">g</DashboardBox>
      <DashboardBox gridArea="h">h</DashboardBox>
      {/* <DashboardBox gridArea="d">
        <BoxHeader
          title="Total Monthly Spending"
          subtitle="Last 12 months"
          sideText={`Total: $${data && data[0].total_over_year}`}
        />
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={monthlySpending}
            margin={{
              top: 17,
              right: 15,
              left: -5,
              bottom: 58,
            }}>
            <defs>
              <linearGradient id="colorSpending" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={palette.primary[300]}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={palette.primary[300]}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke={palette.grey[800]} />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              style={{fontSize: '10px'}}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              style={{fontSize: '10px'}}
            />
            <Tooltip />
            <Bar dataKey="spending" fill="url(#colorSpending)" />
          </BarChart>
        </ResponsiveContainer>
      </DashboardBox> */}
      {/* Cumulative monthly spending*/}

      {/* <DashboardBox gridArea="b">
        <BoxHeader
          title="Cumulative Spending"
          subtitle="Last month vs previous month"
          sideText="+4%"
        />
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            width={500}
            height={400}
            data={data}
            margin={{
              top: 15,
              right: 25,
              left: -10,
              bottom: 60,
            }}>
            <defs>
              <linearGradient id="colorLastMonth" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={palette.primary[300]}
                  stopOpacity={0.5}
                />
                <stop
                  offset="95%"
                  stopColor={palette.primary[300]}
                  stopOpacity={0}
                />
              </linearGradient>
              <linearGradient id="colorPrevMonth" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={palette.primary[600]}
                  stopOpacity={0.5}
                />
                <stop
                  offset="95%"
                  stopColor={palette.primary[600]}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke={palette.grey[800]} />
            <XAxis dataKey="name" tickLine={false} style={{fontSize: '10px'}} />
            <YAxis
              type="number"
              tickLine={false}
              axisLine={{strokeWidth: '0'}}
              style={{fontSize: '10px'}}
            />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="last_month"
              dot={true}
              stroke={palette.primary.main}
              fillOpacity={1}
              fill="url(#colorLastMonth)"
            />
            <Area
              type="monotone"
              dataKey="prev_month"
              dot={true}
              stroke={palette.primary.main}
              fillOpacity={1}
              fill="url(#colorPrevMonth)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </DashboardBox> */}
    </>
  )
}

export default Row1
