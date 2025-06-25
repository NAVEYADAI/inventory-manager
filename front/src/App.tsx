import { BrowserRouter } from "react-router-dom";
import { MainProvider } from "./providers/MainProvider";
import { Router } from "./routes/AppRoutes";

function App() {
  return (
    <BrowserRouter>
      <MainProvider>
        <Router />
      </MainProvider>
    </BrowserRouter>
  );
}

export default App;
