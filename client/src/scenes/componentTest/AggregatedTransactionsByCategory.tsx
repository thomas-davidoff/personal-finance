import { useGetAggregatedTransactionsByCategoryQuery } from "@/state/api"
import { useState } from "react"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts"
import { Box } from "@mui/material"
import { tokens } from "@/theme"

interface Props {
  startDate: string
  endDate: string
}

export default function AggregatedTransactionsByCategory({
  startDate,
  endDate,
}: Props) {
  const { data } = useGetAggregatedTransactionsByCategoryQuery({
    startDate,
    endDate,
  })
  console.log(data)

  const colors = Object.values(tokens.primary)

  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          {data &&
            Object.keys(data[0])
              .filter((key) => key !== "month" && key !== "Balance Transfer")
              .map((key, index) => (
                <Bar
                  key={key}
                  dataKey={key}
                  stackId="a"
                  fill={colors[index % colors.length]}
                />
              ))}
          <Legend />
          <Tooltip />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  )
}
