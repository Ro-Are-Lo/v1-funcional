// frontend/frontent/src/pagues
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EstadisticasUsuarios from '../components/EstadisticasUsuarios';
import Edit_user_admin from './Edit_user_admin';


import html2pdf from 'html2pdf.js';



function Home_user_admin() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  const [filter, setFilter] = useState({
    tipoUsuario: '',
    genero: '',
    edad: '',
    anoEscolar: '',
    nombreApellido: '',
    carrera: ''
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    navigate('/login');
  };

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (!token) {
      setError('No se ha encontrado el token de autenticación. Por favor, inicia sesión.');
      setLoading(false);
      return;
    }

    fetch('http://127.0.0.1:8000/login/usuarios/completos/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(res.status === 401 ? 'No autorizado' : 'Error en la solicitud');
        return res.json();
      })
      .then((data) => {
        setUsuarios(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const filterUsuarios = (usuarios) => {
    return usuarios.filter((u) => {
      if (filter.tipoUsuario && u.user_type !== filter.tipoUsuario) return false;
      if (filter.genero && u.estudiante_profile?.genero !== filter.genero) return false;
      if (filter.edad && u.estudiante_profile?.edad !== Number(filter.edad)) return false;
      if (filter.anoEscolar && u.estudiante_profile?.ult_ano_es !== Number(filter.anoEscolar)) return false;

      const nombreCompleto = `${u.first_name} ${u.last_name} ${u.last_name2}`.toLowerCase();
      if (filter.nombreApellido && !nombreCompleto.includes(filter.nombreApellido.toLowerCase())) return false;

      if (
        filter.carrera &&
        !(
          u.estudiante_profile?.carr_op_A?.toLowerCase().includes(filter.carrera.toLowerCase()) ||
          u.estudiante_profile?.carr_op_B?.toLowerCase().includes(filter.carrera.toLowerCase()) ||
          u.estudiante_profile?.carr_op_C?.toLowerCase().includes(filter.carrera.toLowerCase())
        )
      ) return false;

      return true;
    });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  const replaceColors = () => {
    const elements = document.querySelectorAll('*');
    elements.forEach((el) => {
      const style = window.getComputedStyle(el);
      if (style.color.includes('oklch')) el.style.color = 'black';
      if (style.backgroundColor.includes('oklch')) el.style.backgroundColor = 'white';
    });
  };

  const handleExportToPDF = () => {
    const element = document.getElementById('pdf-content');
    if (!element) return alert('No se encontró el contenido para exportar.');

    setIsExporting(true);
    replaceColors();

    html2pdf()
      .set({
        margin: 0.5,
        filename: `usuarios-filtrados-${new Date().toISOString().slice(0, 10)}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
      })
      .from(element)
      .save()
      .then(() => {
        setIsExporting(false);
        alert('PDF generado con éxito!');
      })
      .catch((err) => {
        setIsExporting(false);
        alert(`Error al generar PDF: ${err.message}`);
      });
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  const filteredUsuarios = filterUsuarios(usuarios);

  return (
  <div className="relative">
    {/* Header fijo */}
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-800 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <h1 className="text-lg font-bold cursor-pointer" onClick={() => navigate('/')}>
        Volver al Inicio
      </h1>

      <div className="flex gap-4">
        {/* Botón abrir/cerrar menú */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md"
        >
          {sidebarOpen ? 'Cerrar Menú' : '☰ Menú'}
        </button>

        {/* Cerrar sesión */}
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md"
        >
          Cerrar sesión
        </button>
      </div>
    </header>

    {/* Sidebar deslizante */}
    {sidebarOpen && (
      <div className="fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-40 p-4 pt-20">
        <h3 className="text-lg font-semibold mb-4">Navegación</h3>
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => navigate('/edit-user')}
              className="text-blue-600 hover:underline"
            >
              Editar Perfil
            </button>
          </li>

          <li>
            <button
              onClick={() => navigate('/estadisticas-usuarios')}
              className="text-blue-600 hover:underline"
            >
              Estadísticas
            </button>
          </li>

          <li><button onClick={() => navigate('/vista3')} className="text-blue-600 hover:underline">Vista 3</button></li>
        </ul>
      </div>
    )}

    {/* Contenido principal desplazado hacia abajo */}
    <main className="p-5 mt-24"/>
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Usuarios Admin</h2>

      {/* Filtros */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Filtros de Búsqueda</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="flex items-center">
            <label className="w-1/3 text-sm text-gray-600">Nombre:</label>
            <input name="nombreApellido" value={filter.nombreApellido} onChange={handleFilterChange} placeholder="Nombre o apellido" className="border p-2 rounded-md w-2/3 bg-gray-50" />
          </div>

          <div className="flex items-center">
            <label className="w-1/3 text-sm text-gray-600">Usuario:</label>
            <select name="tipoUsuario" value={filter.tipoUsuario} onChange={handleFilterChange} className="border p-2 rounded-md w-2/3 bg-gray-50">
              <option value="">Todos</option>
              <option value="admin">Admin</option>
              <option value="estudiante">Estudiante</option>
              <option value="docente">Docente</option>
            </select>
          </div>

          <div className="flex items-center">
            <label className="w-1/3 text-sm text-gray-600">Edad:</label>
            <input type="number" name="edad" value={filter.edad} onChange={handleFilterChange} placeholder="Edad" className="border p-2 rounded-md w-2/3 bg-gray-50" />
          </div>

          <div className="flex items-center">
            <label className="w-1/3 text-sm text-gray-600">Género:</label>
            <select name="genero" value={filter.genero} onChange={handleFilterChange} className="border p-2 rounded-md w-2/3 bg-gray-50">
              <option value="">Todos</option>
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
            </select>
          </div>

          <div className="flex items-center">
            <label className="w-1/3 text-sm text-gray-600">Año Escolar:</label>
            <input type="number" name="anoEscolar" value={filter.anoEscolar} onChange={handleFilterChange} placeholder="Año Escolar" className="border p-2 rounded-md w-2/3 bg-gray-50" />
          </div>

          <div className="flex items-center">
            <label className="w-1/3 text-sm text-gray-600">Carrera:</label>
            <input type="text" name="carrera" value={filter.carrera} onChange={handleFilterChange} placeholder="Carrera" className="border p-2 rounded-md w-2/3 bg-gray-50" />
          </div>
        </div>
      </div>

      {/* Tabla estilo Excel */}
      <div className="overflow-auto max-w-full">
        <table className="min-w-[1000px] table-auto border border-gray-300 text-sm">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="border px-3 py-2">Email</th>
              <th className="border px-3 py-2">Username</th>
              <th className="border px-3 py-2">Tipo</th>
              <th className="border px-3 py-2">Nombre</th>
              <th className="border px-3 py-2">Estado</th>
              <th className="border px-3 py-2">Edad</th>
              <th className="border px-3 py-2">Género</th>
              <th className="border px-3 py-2">Año Escolar</th>
              <th className="border px-3 py-2">Carrera A</th>
              <th className="border px-3 py-2">Carrera B</th>
              <th className="border px-3 py-2">Carrera C</th>
              <th className="border px-3 py-2">Institución</th>
              <th className="border px-3 py-2">Licenciatura</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsuarios.length === 0 ? (
              <tr><td colSpan="13" className="text-center py-4 text-gray-600">No hay usuarios para mostrar.</td></tr>
            ) : (
              filteredUsuarios.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="border px-3 py-2">{u.email}</td>
                  <td className="border px-3 py-2">{u.username}</td>
                  <td className="border px-3 py-2">{u.user_type}</td>
                  <td className="border px-3 py-2">{u.first_name} {u.last_name} {u.last_name2}</td>
                  <td className="border px-3 py-2">{u.is_active ? 'Activo' : 'Inactivo'}</td>
                  <td className="border px-3 py-2">{u.estudiante_profile?.edad ?? 'N/A'}</td>
                  <td className="border px-3 py-2">{u.estudiante_profile?.genero ?? 'N/A'}</td>
                  <td className="border px-3 py-2">{u.estudiante_profile?.ult_ano_es ?? 'N/A'}</td>
                  <td className="border px-3 py-2">{u.estudiante_profile?.carr_op_A || 'N/A'}</td>
                  <td className="border px-3 py-2">{u.estudiante_profile?.carr_op_B || 'N/A'}</td>
                  <td className="border px-3 py-2">{u.estudiante_profile?.carr_op_C || 'N/A'}</td>
                  <td className="border px-3 py-2">{u.docente_profile?.institucion || 'N/A'}</td>
                  <td className="border px-3 py-2">{u.docente_profile?.licenciatura || 'N/A'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PDF export content */}
      <div id="pdf-content" className="bg-white p-6 rounded-lg shadow-md mt-10">
        <h2 className="text-2xl font-bold text-center mb-4">Reporte Estadístico de Usuarios</h2>
        
        <div className="mb-6 text-sm text-gray-700">
          <p><strong>Generado por:</strong> {localStorage.getItem('current_user_email') || 'Usuario desconocido'}</p>
          <p><strong>Fecha y hora:</strong> {new Date().toLocaleString('es-ES')}</p>
          <p><strong>Total de usuarios en el reporte:</strong> {filteredUsuarios.length}</p>
        </div>

        <EstadisticasUsuarios usuarios={filteredUsuarios} />
      </div>


      {/* Exportar PDF */}
      <div className="text-center mt-6">
        <button onClick={handleExportToPDF} className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700" disabled={isExporting}>
          {isExporting ? 'Generando PDF...' : 'Exportar a PDF'}
        </button>
      </div>

     
    </div>
  );
}

export default Home_user_admin;
