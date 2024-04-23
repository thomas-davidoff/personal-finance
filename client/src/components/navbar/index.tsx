import { useState } from "react"
import { Link } from "react-router-dom"
import { Box, Typography, useTheme } from "@mui/material"
import FlexBetween from "../FlexBetween"
import PaidIcon from "@mui/icons-material/Paid"

const NavBar = () => {
  const [selected, setSelected] = useState("dashboard")
  const { palette } = useTheme()
  return (
    <FlexBetween mb="0.25rem" p="0.5rem 0rem" color={palette.grey[300]}>
      <FlexBetween gap="0.75rem">
        <PaidIcon sx={{ fontSize: "28px", color: palette.primary.main }} />
        <Typography variant="h2" color={palette.primary.main}>
          personal finance
        </Typography>
      </FlexBetween>
      <FlexBetween gap="2rem">
        <Box sx={{ "&:hover": palette.primary[100] }}>
          <Link
            to="/"
            onClick={() => setSelected("dashboard")}
            style={{
              color: selected === "dashboard" ? "inherit" : palette.grey[700],
              textDecoration: "inherit",
            }}
          >
            dashboard
          </Link>
        </Box>
        <Box sx={{ "&:hover": palette.primary[100] }}>
          <Link
            to="/budget"
            onClick={() => setSelected("budget")}
            style={{
              color: selected === "budget" ? "inherit" : palette.grey[700],
              textDecoration: "inherit",
            }}
          >
            budget
          </Link>
        </Box>
        <Box sx={{ "&:hover": palette.primary[100] }}>
          <Link
            to="/transactions"
            onClick={() => setSelected("transactions")}
            style={{
              color:
                selected === "transactions" ? "inherit" : palette.grey[700],
              textDecoration: "inherit",
            }}
          >
            transactions
          </Link>
        </Box>
        <Box sx={{ "&:hover": palette.primary[100] }}>
          <Link
            to="/accounts"
            onClick={() => setSelected("accounts")}
            style={{
              color: selected === "accounts" ? "inherit" : palette.grey[700],
              textDecoration: "inherit",
            }}
          >
            accounts
          </Link>
        </Box>
        <Box sx={{ "&:hover": palette.primary[100] }}>
          <Link
            to="/categories"
            onClick={() => setSelected("categories")}
            style={{
              color: selected === "categories" ? "inherit" : palette.grey[700],
              textDecoration: "inherit",
            }}
          >
            categories
          </Link>
        </Box>
        <Box sx={{ "&:hover": palette.primary[100] }}>
          <Link
            to="/test"
            onClick={() => setSelected("testPage")}
            style={{
              color: selected === "testPage" ? "inherit" : palette.grey[700],
              textDecoration: "inherit",
            }}
          >
            test page
          </Link>
        </Box>
      </FlexBetween>
    </FlexBetween>
  )
}

export default NavBar
