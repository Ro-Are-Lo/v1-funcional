import React from 'react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { createUser } from '../Api/api';

export default function CrearUsuarioForm()  {
  const navigate = useNavigate();
  const params = useParams()

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    user_type: '',
    is_active: true,
    is_staff: false,

  });

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createUser(formData);
      alert(' Usuario creado con éxito');
      navigate('/usuario-creado');
    } catch (error) {
      console.error(' Error al crear usuario:', error);
      alert('Hubo un error al crear el usuario.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-md shadow-md mt-10">
      <h2 className="text-2xl font-semibold mb-4 text-center">Crear Usuario</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="username"
          placeholder="Nombre de usuario"
          className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={formData.username}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          onChange={handleChange}
          required
        />

        <select
          name="user_type"
          value={formData.user_type}
          onChange={handleChange}
          required
          className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          
          <option value="Docente">Docente</option>
          <option value="Estudiante">Estudiante</option>
          
        </select>


        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="is_active"
            checked={formData.is_active}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600"
          />
          <label htmlFor="is_active">Usuario activo</label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="is_staff"
            checked={formData.is_staff}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600"
          />
          <label htmlFor="is_staff">Es staff</label>
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition"
        >
          Crear Usuario
        </button>
      </form>
    </div>
  );
};


