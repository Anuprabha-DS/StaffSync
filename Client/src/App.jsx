import { BrowserRouter,Routes,Route} from "react-router-dom"
import Home from "./modules/components/home"
import Register from "./modules/components/Register"
import Dashboard from "./modules/components/Dashboard"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App