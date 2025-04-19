import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router';
import { createUserEst } from '../Api/api';

const EstudianteForm = () => {
    const navigate = useNavigate();
    const params = useParams()
  
    const [formData, setFormData] = useState({
    nombre: '',
    apellido_paterno: '',
    apellido_materno: '',
    edad: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createUserEst(formData);
      alert(' Estudiante creado con éxito');
      navigate('/usuario-est'),
      setFormData({
        nombre: '',
        apellido_paterno: '',
        apellido_materno: '',
        edad: ''
      });
    } catch (error) {
      console.error(' Error al crear estudiante:', error);
      alert('Hubo un error al crear el estudiante.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Crear Estudiante</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={formData.nombre}
          onChange={handleChange}
          className="border px-4 py-2 rounded"
          required
        />
        <input
          type="text"
          name="apellido_paterno"
          placeholder="Apellido Paterno"
          value={formData.apellido_paterno}
          onChange={handleChange}
          className="border px-4 py-2 rounded"
          required
        />
        <input
          type="text"
          name="apellido_materno"
          placeholder="Apellido Materno"
          value={formData.apellido_materno}
          onChange={handleChange}
          className="border px-4 py-2 rounded"
          required
        />
        <input
          type="number"
          name="edad"
          placeholder="Edad"
          value={formData.edad}
          onChange={handleChange}
          className="border px-4 py-2 rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Crear Estudiante
        </button>
      </form>
    </div>
  );
};

export default EstudianteForm;
