import React from 'react'; // Asegúrate de importar React
import { BrowserRouter, Routes, Route } from 'react-router'; // Asegúrate de importar las rutas
import Header from './components/Header';
import User_log from './components/User_log';
import Home_body from './components/Home_body';
import EstudianteForm from './components/EstudianteForm';
import Footer from './components/Footer';

function App() {
  return (
    <BrowserRouter>
      <div className="container mx-auto">
        <Header />
        <Routes>
          {/* Aquí añades la ruta para la página de inicio */}
          {/* <Route path="/" element={<Home />} />  Asumiendo que tienes un componente Home */}
          <Route path='/' element={<Home_body/>}/>
          <Route path="/usuario-creado" element={<User_log />} />
          <Route path="/usuario-est" element ={<EstudianteForm/>}/>
          
          {/* Añade las demás rutas aquí */}
        </Routes>
        <Footer /> 
      </div>
    </BrowserRouter>
  );
}

export default App;

