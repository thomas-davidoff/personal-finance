import { Typography, useTheme } from "@mui/material"
import DashboardBox from "@/components/DashboardBox"

type Props = {
  number: number | undefined
  subtitle: string
}

const NumberSummary = ({ number, subtitle }: Props) => {
  const { palette } = useTheme()

  const display =
    number && number > 0 ? `$${number}` : `-$${number ? number * -1 : 0}`

  console.log(number && number > 0 ? true : false)
  return (
    <DashboardBox
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        padding: 4,
        height: "100%",
      }}
    >
      <Typography variant="h1" fontWeight="700">
        {display}
      </Typography>
      <Typography color={palette.grey[500]}>{subtitle}</Typography>
    </DashboardBox>
  )
}

export default NumberSummary
