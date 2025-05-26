import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function EstudianteForm() {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    first_name: '',
    last_name: '',
    last_name2: '',
    password: '',
    edad: '',
    genero: '',
    ult_ano_es: '',
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const payload = {
      user: {
        email: formData.email,
        username: formData.username,
        password: formData.password,      // password justo después de username
        first_name: formData.first_name,
        last_name: formData.last_name,
        last_name2: formData.last_name2,
      },
      edad: formData.edad ? Number(formData.edad) : null,
      genero: formData.genero,
      ult_ano_es: formData.ult_ano_es ? Number(formData.ult_ano_es) : null,
    };

    try {
      const response = await axios.post('http://127.0.0.1:8000/login/estudiantes/', payload);

      if (response.status === 201) {
        await loginAfterRegister(formData.email, formData.password);

        alert('Estudiante creado y autenticado con éxito');
        navigate('/estudiante');

        setFormData({
          email: '',
          username: '',
          first_name: '',
          last_name: '',
          last_name2: '',
          password: '',
          edad: '',
          genero: '',
          ult_ano_es: '',
        });
      } else {
        setError('Error al crear estudiante');
      }
    } catch (error) {
      console.error('Error en el registro:', error);
      setError(error.response?.data || 'Error inesperado');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Registrar Estudiante</h2>
      {error && <p className="text-red-600 mb-4">{JSON.stringify(error)}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="username"
          placeholder="Nombre de usuario"
          value={formData.username}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="first_name"
          placeholder="Primer nombre"
          value={formData.first_name}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="last_name"
          placeholder="Apellido paterno"
          value={formData.last_name}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="last_name2"
          placeholder="Apellido materno"
          value={formData.last_name2}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          name="edad"
          placeholder="Edad"
          value={formData.edad}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <select
          name="genero"
          value={formData.genero}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Selecciona género</option>
          <option value="M">Masculino</option>
          <option value="F">Femenino</option>
          <option value="O">Otro</option>
        </select>
        <input
          type="number"
          name="ult_ano_es"
          placeholder="Último año escolar"
          value={formData.ult_ano_es}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
        >
          Registrar
        </button>
      </form>
    </div>
  );
}

export default EstudianteForm;
