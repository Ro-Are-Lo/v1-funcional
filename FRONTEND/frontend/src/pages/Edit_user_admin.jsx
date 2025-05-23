import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Edit_user_admin() {
  const [formData, setFormData] = useState({
    user: {
      email: '',
      username: '',
      first_name: '',
      last_name: '',
      last_name2: '',
    },

  });

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (!token) return;

    fetch('http://127.0.0.1:8000/login/usuarios/perfil/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setFormData({
          user: {
            email: data.user.email || '',
            username: data.user.username || '',
            first_name: data.user.first_name || '',
            last_name: data.user.last_name || '',
            last_name2: data.user.last_name2 || '',
          },
          
        });
      })
      .catch(err => {
        console.error('Error al obtener datos:', err);
        setError(err.message);
      });
  }, []);

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      user: { ...prev.user, [name]: value }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access');

    fetch('http://127.0.0.1:8000/login/usuarios/perfil/', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al actualizar el perfil');
        return res.json();
      })
      .then(data => {
        alert('Perfil actualizado con éxito');
        navigate('/home'); // Redirige a la vista principal
      })
      .catch(err => {
        console.error('Error:', err);
        setError(err.message);
      });
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold text-center mb-4">Editar mi Perfil</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { name: 'username', label: 'Usuario' },
          { name: 'email', label: 'Correo', type: 'email' },
          { name: 'first_name', label: 'Nombre' },
          { name: 'last_name', label: 'Apellido Paterno' },
          { name: 'last_name2', label: 'Apellido Materno' }
        ].map(({ name, label, type = 'text' }) => (
          <div key={name}>
            <label className="block text-sm font-medium text-gray-700">{label}:</label>
            <input
              type={type}
              name={name}
              value={formData.user[name]}
              onChange={handleUserChange}
              className="w-full p-2 border rounded"
            />
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Guardar Cambios
        </button>
      </form>
    </div>
  );
}

export default Edit_user_admin;
