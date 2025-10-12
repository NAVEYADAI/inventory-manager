import { BrowserRouter } from "react-router-dom";
import { MainProvider } from "./providers/MainProvider";
import { Router } from "./routes/AppRoutes";
import { createTheme, ThemeProvider } from "@mui/material";
import { prefixer } from "stylis";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import rtlPlugin from "stylis-plugin-rtl";


function App() {
  const cacheRtl = createCache({
    key: "mui-rtl",
    stylisPlugins: [prefixer, rtlPlugin],
  });
  
  const theme = createTheme({
    direction: "rtl",
  
    palette: {
      mode: "light",
      primary: { main: "#1976d2" },
      secondary: { main: "#9c27b0" },
      background: {
        default: "#fafafa",
        paper: "#ffffff",
      },
      text: {
        primary: "#0d0d0d",
        secondary: "#555",
      },
    },
  
    typography: {
      fontFamily: `'Assistant', 'Arial', sans-serif`,
      fontSize: 14,
      h1: { fontWeight: 600, fontSize: "2rem" },
      h2: { fontWeight: 600, fontSize: "1.6rem" },
      h3: { fontWeight: 500, fontSize: "1.4rem" },
      body1: { lineHeight: 1.6 },
      button: { textTransform: "uppercase", fontWeight: 500 },
    },
  
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            direction: "rtl",
            fontFamily: `'Assistant', 'Arial', sans-serif`,
            backgroundColor: "#fafafa",
            color: "#0d0d0d",
          },
        },
      },
    },
  });

  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <MainProvider>
            <Router />
          </MainProvider>
        </BrowserRouter>
      </ThemeProvider>
    </CacheProvider>
  );
}

export default App;
