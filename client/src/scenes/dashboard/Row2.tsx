import BoxHeader from '@/components/BoxHeader'
import DashboardBox from '@/components/DashboardBox'
import {useGetKpisQuery} from '@/state/api'
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
  ReferenceLine,
} from 'recharts'

const Row2 = () => {
  const {palette} = useTheme()
  const {data} = useGetKpisQuery()

  const revenue = useMemo(() => {
    return (
      data &&
      data[0].monthlyData.map(({month, revenue}) => {
        return {
          name: month.substring(0, 3),
          revenue: parseInt(revenue.replace('$', '')),
        }
      })
    )
  }, [data])

  const revenueExpenses = useMemo(() => {
    return (
      data &&
      data[0].monthlyData.map(({month, revenue, expenses}) => {
        return {
          name: month.substring(0, 3),
          revenue: parseInt(revenue.replace('$', '')),
          expenses: parseInt(expenses.replace('$', '')) * -1,
        }
      })
    )
  }, [data])

  const revenueProfit = useMemo(() => {
    return (
      data &&
      data[0].monthlyData.map(({month, revenue, expenses}) => {
        return {
          name: month.substring(0, 3),
          revenue: parseInt(revenue.replace('$', '')),
          profit: (
            parseInt(revenue.replace('$', '')) -
            parseInt(expenses.replace('$', ''))
          ).toFixed(2),
        }
      })
    )
  }, [data])

  return (
    <>
      <DashboardBox gridArea="d">
        <BoxHeader
          title="Revenue vs Expenses"
          subtitle="stacked bar chart comparing revenue and expenses"
          sideText="+4%"
        />
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={revenueExpenses}
            stackOffset="sign"
            margin={{
              top: 20,
              right: 10,
              left: 10,
              bottom: 55,
            }}>
            <defs>
              <linearGradient id="colorRevenue3" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={palette.primary[300]}
                  stopOpacity={0.2}
                />
                <stop
                  offset="95%"
                  stopColor={palette.primary[300]}
                  stopOpacity={0.8}
                />
              </linearGradient>
              <linearGradient id="colorExpenses3" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={palette.secondary[300]}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={palette.secondary[300]}
                  stopOpacity={0.2}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke={palette.grey[800]} />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="revenue"
              fill="url(#colorExpenses3)"
              stackId="stack"
            />
            <Bar
              dataKey="expenses"
              fill="url(#colorRevenue3)"
              stackId="stack"
              opacity={0.5}
            />
          </BarChart>
        </ResponsiveContainer>
      </DashboardBox>
      <DashboardBox gridArea="e">
        <BoxHeader
          title="Profit and Revenue"
          subtitle="top line represents revenue, bottom line represents expenses"
          sideText="+4%"
        />
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={500}
            height={400}
            data={revenueProfit}
            margin={{
              top: 20,
              right: 0,
              left: -10,
              bottom: 55,
            }}>
            <CartesianGrid vertical={false} stroke={palette.grey[800]} />
            <XAxis dataKey="name" tickLine={false} style={{fontSize: '10px'}} />
            <YAxis
              yAxisId="left"
              tickLine={false}
              axisLine={false}
              style={{fontSize: '10px'}}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickLine={false}
              axisLine={false}
              style={{fontSize: '10px'}}
            />
            <Tooltip />
            <Legend
              height={20}
              wrapperStyle={{
                margin: '0 0 10px 0',
              }}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="profit"
              stroke={palette.tertiary[500]}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="revenue"
              stroke={palette.primary.main}
            />
          </LineChart>
        </ResponsiveContainer>
      </DashboardBox>
      <DashboardBox gridArea="f">
        <BoxHeader
          title="Profit and Revenue"
          subtitle="top line represents revenue, bottom line represents expenses"
          sideText="+4%"
        />
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={500}
            height={400}
            data={revenueProfit}
            margin={{
              top: 20,
              right: 0,
              left: -10,
              bottom: 55,
            }}>
            <CartesianGrid vertical={false} stroke={palette.grey[800]} />
            <XAxis dataKey="name" tickLine={false} style={{fontSize: '10px'}} />
            <YAxis
              yAxisId="left"
              tickLine={false}
              axisLine={false}
              style={{fontSize: '10px'}}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickLine={false}
              axisLine={false}
              style={{fontSize: '10px'}}
            />
            <Tooltip />
            <Legend
              height={20}
              wrapperStyle={{
                margin: '0 0 10px 0',
              }}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="profit"
              stroke={palette.tertiary[500]}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="revenue"
              stroke={palette.primary.main}
            />
          </LineChart>
        </ResponsiveContainer>
      </DashboardBox>
    </>
  )
}

export default Row2
