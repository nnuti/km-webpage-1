import { createTheme } from "@mui/material/styles"
import { Colors } from "./Colors"
import { shadows } from "./Shadows"
import typography from "./Typography"


const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: Colors.primary,
      light: Colors.light,
      dark: Colors.primary,
    },
    secondary: {
      main: Colors.secondary,
      light: Colors.light,
      dark: Colors.secondary,
    },
  },
  shadows: shadows,
  typography: typography,
})

export default theme