import { createTheme } from "@mui/material/styles"
import { CssBaseline, ThemeProvider, Box } from "@mui/material"
import { useMemo } from "react"
import { themeSettings } from "@/theme"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import NavBar from "@/components/navbar"
import Dashboard from "@/scenes/dashboard"
import Budget from "@/scenes/budget"
import Transactions from "@/scenes/transactions"

function App() {
  const theme = useMemo(() => createTheme(themeSettings), [])
  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Box height="100%" width="100%" padding="1rem 2rem 4rem 2rem" bgcolor={theme.palette.background.default}>
            <NavBar></NavBar>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/budget" element={<Budget />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/accounts" element={<div>Accounts</div>} />
            </Routes>
          </Box>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  )
}

export default App
