// // src/pages/Home_user_doce.jsx


import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// COOKIE helper
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

function Home_user_doce() {
  const [usuario, setUsuario] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    first_name: '',
    last_name: '',
    last_name2: '',
    password: '',
    institucion: '',
    licenciatura: '',
  });
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [file, setFile] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access');

    if (!token) {
      console.error("Token no encontrado.");
      return;
    }

    fetch('http://127.0.0.1:8000/login/docentes/perfil/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status === 401) throw new Error('No autorizado');
        return res.json();
      })
      .then((data) => {
        setUsuario(data);
        setFormData({
          email: data.user?.email || '',
          username: data.user?.username || '',
          first_name: data.user?.first_name || '',
          last_name: data.user?.last_name || '',
          last_name2: data.user?.last_name2 || '',
          password: '',
          institucion: data.institucion || '',
          licenciatura: data.licenciatura || '',
        });
      })
      .catch((err) => {
        console.error('Error al obtener perfil:', err);
        setError(err.message);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access');

    fetch('http://127.0.0.1:8000/login/docentes/perfil/', {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al actualizar');
        return res.json();
      })
      .then(data => {
        setUsuario(data);
        setIsEditing(false);
      })
      .catch(err => {
        setError(err.message);
      });
  };

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    navigate('/login');
  };

  const handleUploadQuestions = (e) => {
    e.preventDefault();
    if (!file) return alert("Por favor selecciona un archivo Excel.");

    const formDataToSend = new FormData();
    formDataToSend.append('file', file);

    const token = localStorage.getItem('access');
    const csrfToken = getCookie('csrftoken');

    fetch('http://127.0.0.1:8000/test/upload-excel/', {
      method: 'POST',
      headers: {
        'X-CSRFToken': csrfToken,
        'Authorization': `Bearer ${token}`,
      },
      body: formDataToSend,
    })
      .then(res => {
        if (!res.ok) return res.json().then(errorData => {
          throw new Error(errorData.error || 'Error desconocido');
        });
        return res.json();
      })
      .then(() => {
        alert('Preguntas subidas correctamente.');
      })
      .catch(err => {
        alert('Error al subir las preguntas: ' + err.message);
      });
  };

  if (error) return <div>Error: {error}</div>;
  if (!usuario) return <div>Cargando...</div>;

  return (
    <div className="relative">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-800 text-white px-6 py-4 flex justify-between items-center shadow-md">
        <h1 className="text-lg font-bold cursor-pointer" onClick={() => navigate('/')}>
          Volver al Inicio
        </h1>

        <div className="flex gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md"
          >
            {sidebarOpen ? 'Cerrar Menú' : '☰ Menú'}
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md"
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      {/* Sidebar */}
      {sidebarOpen && (
        <div className="fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-40 p-4 pt-20">
          <h3 className="text-lg font-semibold mb-4">Navegación</h3>
          <ul className="space-y-2">
            <li>
              <button onClick={() => navigate('/')} className="text-blue-600 hover:underline">
                Inicio
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/perfil-docente')} className="text-blue-600 hover:underline">
                Perfil
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/subir-preguntas')} className="text-blue-600 hover:underline">
                Subir Preguntas
              </button>
            </li>
          </ul>
        </div>
      )}

      {/* Contenido principal */}
      <main className="mt-24 p-6 max-w-2xl mx-auto bg-white rounded-md shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          {isEditing ? 'Editar Perfil Docente' : 'Perfil Docente'}
        </h2>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { name: 'username', label: 'Usuario' },
              { name: 'email', label: 'Email', type: 'email' },
              { name: 'first_name', label: 'Primer Nombre' },
              { name: 'last_name', label: 'Apellido Paterno' },
              { name: 'last_name2', label: 'Apellido Materno' },
              { name: 'password', label: 'Contraseña', type: 'password' },
              { name: 'institucion', label: 'Institución' },
              { name: 'licenciatura', label: 'Licenciatura' },
            ].map(({ name, label, type = 'text' }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700">{label}:</label>
                <input
                  type={type}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            ))}
            <div className="text-center">
              <button type="submit" className="mt-4 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                Guardar Cambios
              </button>
            </div>
          </form>
        ) : (
          <div>
            <h3><strong>Nombre de Usuario:</strong> {formData.username}</h3>
            <p><strong>Email:</strong> {formData.email}</p>
            <p><strong>Primer Nombre:</strong> {formData.first_name}</p>
            <p><strong>Apellido Paterno:</strong> {formData.last_name}</p>
            <p><strong>Apellido Materno:</strong> {formData.last_name2}</p>
            <p><strong>Institución:</strong> {formData.institucion}</p>
            <p><strong>Licenciatura:</strong> {formData.licenciatura}</p>

            <button onClick={() => setIsEditing(true)} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Editar Perfil
            </button>

            <div className="mt-6">
              <h3 className="font-medium text-lg">Subir Preguntas</h3>
              <form onSubmit={handleUploadQuestions} className="space-y-4">
                <input
                  type="file"
                  accept=".xlsx"
                  onChange={handleFileChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <button
                  type="submit"
                  className="mt-4 px-6 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
                >
                  Subir Preguntas
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Home_user_doce;

