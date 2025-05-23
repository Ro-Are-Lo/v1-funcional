import  { useState,React } from 'react';
import { useNavigate } from 'react-router';
import { createUserEst } from '../Api/api';
import axios from 'axios';

const EstudianteForm = () => {
  const navigate = useNavigate();

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

// subri formulatio con lo datos
  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    // Preparar el payload con los campos correctos y sus valores
    const payload = {
      user: {
        email: formData.email,
        username: formData.username,  // Si el backend usa username, mantén este campo
        first_name: formData.first_name,
        last_name: formData.last_name,
        last_name2: formData.last_name2,
        password: formData.password,
      },
      edad: parseInt(formData.edad),
      genero: formData.genero,
      ult_ano_es: parseInt(formData.ult_ano_es),
     // Si el campo es vacío, envíalo vacío (según lo que el backend espera)
    };

    // Enviar la solicitud con Axios o la función que estés usando para la creación del estudiante
    const response = await createUserEst(payload);

    
  // Función para hacer login después del registro
  const loginAfterRegister = async (email, password) => {
  console.log('Enviando login con:', email, password); // Depuración

  try {
    // Haciendo la solicitud POST al endpoint de login
    const response = await axios.post('http://127.0.0.1:8000/login/api/token/', {
      email,  // El correo electrónico del usuario
      password, // La contraseña del usuario
    });

    console.log('Respuesta del login:', response.status, response.data); // Ver respuesta del servidor

    // Verificar que la respuesta sea exitosa (código 200)
    if (response.status === 200) {
      const data = response.data;

      // Guardar los tokens de acceso y refresh en el localStorage
      localStorage.setItem('access', data.access);
      localStorage.setItem('refresh', data.refresh);

      console.log('Tokens almacenados en localStorage');
    } else {
      throw new Error('No se pudo obtener el token.');
    }
  } catch (error) {
    console.error('Error al hacer login:', error);
    alert('Error al hacer login tras el registro. Por favor, intenta nuevamente.');
  }
};

    
    // Si la respuesta es exitosa, realiza el login automáticamente
    if (response.status === 201) {
      await loginAfterRegister(formData.email, formData.password);  // Login con email

      alert('Estudiante creado y autenticado con éxito');
      navigate('/estudiante'); // Redirigir al home del estudiante

      // Limpiar el formulario
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
    
    } 
    
    else {
      console.error('Error al crear el estudiante:', response.data);
      alert('Hubo un error al crear el estudiante.');
      } 
    }
     catch (error) {
    console.error('Error al crear estudiante:', error);
    alert('Hubo un error al crear o autenticar al estudiante.');
  
  }

  
};


  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Crear Estudiante</h2>
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
          className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <input
          type="text"
          name="last_name"
          placeholder="Apellido Paterno"
          value={formData.last_name}
          onChange={handleChange}
          className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <input
          type="text"
          name="last_name2"
          placeholder="Apellido Materno"
          value={formData.last_name2}
          onChange={handleChange}
          className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
          min="1"
          max="120"
        />
        <input
          type="number"
          name="ult_ano_es"
          placeholder="Año de Estudio"
          value={formData.ult_ano_es}
          onChange={handleChange}
          className="border px-4 py-2 rounded"
          required
          min="1900"
          max="9999"
        />
        <select
          name="genero"
          value={formData.genero}
          onChange={handleChange}
          className="border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        >
          <option value="">Selecciona un Género</option>
          <option value="M">Masculino</option>
          <option value="F">Femenino</option>
          <option value="O">Otro</option>
        </select>
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
