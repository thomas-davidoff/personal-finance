import { Box } from "@mui/material"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts"
import {
  useGetAggregatedTransactionsByCategoryQuery,
  useGetColorSchemeQuery,
} from "@/state/api"
import { apiColors } from "@/theme"
import { getColorObjectByKey } from "@/components/funx"

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

  const { data: colorMap } = useGetColorSchemeQuery()

  const colorsMap = {}

  const results =
    data &&
    Object.keys(data).map((month) => {
      const categoriesData = data[month]
      const result = { month }
      Object.keys(categoriesData).forEach((categoryName) => {
        result[categoryName] = categoriesData[categoryName].total_debits * -1
        colorsMap[categoryName] = categoriesData[categoryName].color
      })
      return result
    })

  console.log(colorsMap)

  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={results}>
          <XAxis dataKey="month" />
          <YAxis />
          {results &&
            Object.keys(results[0])
              .filter(
                (key) =>
                  key !== "month" && !key.toLowerCase().includes("balance")
              )
              .map((category) => {
                const color = Object.prototype.hasOwnProperty.call(
                  apiColors,
                  colorsMap[category]
                )
                  ? apiColors[colorsMap[category]]
                  : "grey"
                return (
                  <Bar
                    key={category}
                    dataKey={category}
                    name={category}
                    fill={
                      getColorObjectByKey(colorMap, colorsMap[category])
                        .background
                    } // Using mapped colors
                    stackId="a"
                  />
                )
              })}
          <Legend />
          <Tooltip />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  )
}
