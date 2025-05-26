import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
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
import SeleccionRol from './components/SelectorUser';
import Edit_user_admin from './pages/Edit_user_admin';
import EstadisticasPage from './components/Estadisticas_page';

function AppContent() {
  const location = useLocation();

  // Rutas donde NO quieres mostrar el Header y Footer
  const noHeaderRoutes = ['/admin'];

  const shouldHideHeader = noHeaderRoutes.includes(location.pathname);

  return (
    <div className="container mx-auto">
      {!shouldHideHeader && <Header />}
      
      <Routes>
        <Route path='/' element={<Home_body />} />
        <Route path="/crear-user" element={<User_log />} />
        <Route path="/crear-estudiante" element={<EstudianteForm />} />
        <Route path="/crear-docente" element={<DocenteForm />} />
        <Route path="/login" element={<LoginForm />} />
        
        {/* rutas de los logeos con tokens */}
        <Route path="/admin" element={<Home_user_admin />} />
        <Route path="/docente" element={<Home_user_doce />} />
        <Route path="/estudiante" element={<Home_user_estu />} />

        <Route path="/edit-user" element={<Edit_user_admin />} /> {/* Ruta para edición */}

        <Route path="/estadisticas-usuarios" element={<EstadisticasPage />} />

        <Route path="/test" element={<SelectorPreguntas />} />
        <Route path="/selector" element={<SeleccionRol />} />

        
      </Routes>

      {!shouldHideHeader && <Footer />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
