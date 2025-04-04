import { BrowserRouter, Route, Routes } from "react-router" 
import UsuarioList from "./componets/UsuarioList"
import UsuarioForm from "./componets/UsuarioForm"
import Header from "./componets/Header"

function App() {
 
//componentes
  return (
   
    <BrowserRouter>
      <div className="container mx-auto">
        <Header/> 
        <Routes >
          <Route path="/" element={<UsuarioList/>}/>  
         
          <Route path="/usuarios-nuevos" element={<UsuarioForm />}/>
          <Route path="/editar-usuario/:id" element={<UsuarioForm/>}/>
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
