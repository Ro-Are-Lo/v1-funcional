import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { createUserDoc } from '../Api/api';

const DocenteForm = () => {
  const navigate = useNavigate();

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

  // 🔐 Función para hacer login tras registrar al docente
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        user: {
          email: formData.email,
          username: formData.username,
          first_name: formData.first_name,
          last_name: formData.last_name,
          last_name2: formData.last_name2,
          password: formData.password,
        },
        institucion: formData.institucion,
        licenciatura: formData.licenciatura,
      };

      await createUserDoc(payload);

      // 🔐 Login después de registro
      await loginAfterRegister(formData.email, formData.password);

      alert('Docente creado y autenticado con éxito');
      navigate('/docente');

      setFormData({
        email: '',
        username: '',
        first_name: '',
        last_name: '',
        last_name2: '',
        password: '',
        institucion: '',
        licenciatura: '',
      });
    } catch (error) {
      console.error('❌ Error al crear docente:', error);
      console.error('❗ Detalle:', error.response?.data);
      alert('Error al registrar o autenticar docente.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Crear Docente</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          name="email"
          placeholder="Correo Electrónico"
          value={formData.email}
          onChange={handleChange}
          className="border px-4 py-2 rounded"
          required
        />
        <input
          type="text"
          name="username"
          placeholder="Nombre de Usuario"
          value={formData.username}
          onChange={handleChange}
          className="border px-4 py-2 rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={handleChange}
          className="border px-4 py-2 rounded"
          required
        />
        <input
          type="text"
          name="first_name"
          placeholder="Nombre"
          value={formData.first_name}
          onChange={handleChange}
          className="border rounded px-4 py-2"
          required
        />
        <input
          type="text"
          name="last_name"
          placeholder="Apellido Paterno"
          value={formData.last_name}
          onChange={handleChange}
          className="border rounded px-4 py-2"
          required
        />
        <input
          type="text"
          name="last_name2"
          placeholder="Apellido Materno"
          value={formData.last_name2}
          onChange={handleChange}
          className="border rounded px-4 py-2"
          required
        />
        <input
          type="text"
          name="institucion"
          placeholder="Institución"
          value={formData.institucion}
          onChange={handleChange}
          className="border rounded px-4 py-2"
          required
        />
        <input
          type="text"
          name="licenciatura"
          placeholder="Licenciatura"
          value={formData.licenciatura}
          onChange={handleChange}
          className="border rounded px-4 py-2"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Crear Docente
        </button>
      </form>
    </div>
  );
};

export default DocenteForm;
