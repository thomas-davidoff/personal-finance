import {
  useGetAccountRunningBalanceQuery,
  useGetAccountsQuery,
} from "@/state/api"
import { useState } from "react"
import {
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  ResponsiveContainer,
} from "recharts"
import { Box } from "@mui/material"

interface Props {
  startDate: string
  endDate: string
}

export default function AccountRunningBalanceChart({
  startDate,
  endDate,
}: Props) {
  const { data: accounts } = useGetAccountsQuery()

  const graphLines = accounts
    ? [...accounts.map((acc) => acc.name), "net_worth"]
    : []

  const lineColors = {
    net_worth: "red",
    other: "#8884d8",
  }

  const { data } = useGetAccountRunningBalanceQuery({
    startDate,
    endDate,
  })

  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={730}
          height={250}
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          {graphLines.map((acc) => (
            <Line
              key={`${acc}_line`}
              type="monotone"
              dataKey={acc}
              stroke={
                Object.prototype.hasOwnProperty.call(lineColors, acc)
                  ? lineColors[acc]
                  : lineColors.other
              }
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Box>
  )
}
