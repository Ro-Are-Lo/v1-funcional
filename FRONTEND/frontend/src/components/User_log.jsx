import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { createUser } from '../Api/api';
import axios from 'axios';

export default function CrearUsuarioForm() {
  const navigate = useNavigate();
  const params = useParams();

  const [formData, setFormData] = useState({
    email: '',
    username: '',
    first_name: '',
    last_name: '',
    last_name2: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // 🔐 Función para hacer login y guardar tokens
  const loginAfterRegister = async (email, password) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/login/api/token/', {
        email,
        password,
      });

      if (response.status === 200) {
        const data = response.data;
        localStorage.setItem('access', data.access);
        localStorage.setItem('refresh', data.refresh);
      } else {
        throw new Error('No se pudo obtener el token.');
      }
    } catch (error) {
      console.error('Error al hacer login:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createUser({
        ...formData,
        is_active: true,
        is_staff: true,
        is_superuser: true,
      });

      // 🔐 Login después de registro
      await loginAfterRegister(formData.email, formData.password);

      alert('Usuario admin creado y autenticado con éxito');
      navigate('/admin');
    } catch (error) {
      console.error('Error al crear usuario:', error);
      alert('Hubo un error al crear o autenticar el usuario.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-md shadow-md mt-10">
      <h2 className="text-2xl font-semibold mb-4 text-center">Crear Usuario</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="username"
          placeholder="Nombre de Usuario"
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
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="first_name"
          placeholder="Nombre"
          className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={formData.first_name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="last_name"
          placeholder="Apellido Paterno"
          className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={formData.last_name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="last_name2"
          placeholder="Apellido Materno"
          className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={formData.last_name2}
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition"
        >
          Crear Usuario
        </button>
      </form>
    </div>
  );
}
