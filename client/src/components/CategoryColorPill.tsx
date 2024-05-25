import { useGetColorSchemeQuery } from "@/state/api"
import { Box } from "@mui/material"
import { getColorObjectByKey } from "@/components/funx"

interface Props {
  label: string
  colorKey: string
}

export default function CategoryColorPill({ label, colorKey }: Props) {
  const { data } = useGetColorSchemeQuery()
  const color = data && getColorObjectByKey(data, colorKey)
  return data ? (
    <Box
      sx={{
        bgcolor: color.background,
        color: color.foreground,
        p: "2px 10px 2px 10px",
        borderRadius: "15px",
      }}
    >
      {label}
    </Box>
  ) : null
}
