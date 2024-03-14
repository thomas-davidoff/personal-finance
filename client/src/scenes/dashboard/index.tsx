import {Box, useMediaQuery} from '@mui/material'
import Row1 from '@/scenes/dashboard/Row1'
import {
  gridTemplateLargeScreens,
  gridTemplateSmallScreens,
} from '@/scenes/dashboard/gridtemplate'
import {useState} from 'react'

const Dashboard = () => {
  const isAboveMediumScreens = useMediaQuery('(min-width: 1200px)')

  const [selectedMonth, setSelectedMonth] = useState('10')
  const [selectedYear, setSelectedYear] = useState('2023')

  return (
    <Box
      width="100%"
      height="100%"
      display="grid"
      gap="1.5rem"
      sx={
        isAboveMediumScreens
          ? {
              gridTemplateColumns: 'repeat(3, minmax(370px, 1fr))',
              gridTemplateRows: 'repeat(10, minmax(60px, 1fr))',
              gridTemplateAreas: gridTemplateLargeScreens,
            }
          : {
              gridAutoColumns: '1fr',
              gridAutoRows: '80px',
              gridTemplateAreas: gridTemplateSmallScreens,
            }
      }>
      <Row1
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        setSelectedMonth={setSelectedMonth}
        setSelectedYear={setSelectedYear}
      />
    </Box>
  )
}

export default Dashboard
