import React from 'react'; // Asegúrate de importar React
import { BrowserRouter, Routes, Route } from 'react-router'; // Asegúrate de importar las rutas
import Header from './components/Header';
import User_log from './components/User_log';
import Home_body from './components/Home_body';
import EstudianteForm from './components/EstudianteForm';
import Footer from './components/Footer';
import LoginForm from './components/LoginForm';
import Home_user_admin from './pages/Home_user_admin';
import Home_user_doce from './pages/Home_user_doce';
import Home_user_estu from './pages/Home_user_estu';
import SelectorPreguntas from './components/SelectorPreguntas';
import DocenteForm from './components/DocenteForm';

function App() {
  return (
    <BrowserRouter>
      <div className="container mx-auto">
      <Header />
        <Routes>
          {/* Aquí añades la ruta para la página de inicio */}
          {/* <Route path="/" element={<Home />} />  Asumiendo que tienes un componente Home */}
          <Route path='/' element={<Home_body/>}/>
          <Route path="/crear-user" element={<User_log />} />
          <Route path="/crear-estudiante" element ={<EstudianteForm/>}/>
          <Route path="/crear-docente" element ={<DocenteForm/>}/>

          <Route path="/login" element={<LoginForm />} />
          
          {/* rutas de los logeos con tokens */}
          <Route path="/admin" element={<Home_user_admin/>} />
          <Route path="/docente" element={<Home_user_doce/>} />
          <Route path="/estudiante" element={<Home_user_estu/>} />

          <Route path="/test" element={<SelectorPreguntas />} />

          {/* Añade las demás rutas aquí */}
        </Routes>
        <Footer /> 
      </div>
    </BrowserRouter>
  );
}

export default App;

