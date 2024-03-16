import Box from "@mui/material/Box"
import { BreakdownProps } from "@/scenes/dashboard/types"
import { Typography, useTheme } from "@mui/material"
import { Grid } from "@mui/material"

export default function Breakdown({
  aggregateByTransactionCategory,
  aggregateByTransactionType,
}: BreakdownProps) {
  const { palette } = useTheme()

  const formatted = aggregateByTransactionType.map((transactionType) => ({
    type: transactionType.transaction_type,
    total: transactionType.total,
    transactions: aggregateByTransactionCategory.filter(
      (category) =>
        category.transaction_type === transactionType.transaction_type
    ),
  }))

  return (
    <Box
      sx={{
        height: 400,
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {formatted.map((transactionType) => (
        <Grid
          container
          key={`${transactionType.type}_container`}
          sx={{ padding: 2 }}
        >
          <Grid item xs={12}>
            <Typography textTransform="uppercase" mb={1}>
              {transactionType.type}
            </Typography>
          </Grid>
          {[
            ...transactionType.transactions,
            { category: "TOTAL", total: transactionType.total },
          ].map((item) => (
            <>
              <Grid item xs={9}>
                <Typography color={palette.grey[500]}>
                  {item.category}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography color={palette.grey[500]}>{item.total}</Typography>
              </Grid>
            </>
          ))}
        </Grid>
      ))}
    </Box>
  )
}
