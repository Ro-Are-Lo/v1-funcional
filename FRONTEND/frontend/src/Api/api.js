// import axios from 'axios';

// // Base de tu backend (ajustalo si cambia)
// const userApi = axios.create({
//   baseURL: 'http://127.0.0.1:8000/login/',
// });

// // http://127.0.0.1:8000/login/estudiantes/

// // Ejemplo para crear usuario
// export const createUser = (userData) => userApi.post('/usuarios/', userData);
// export const createUserEst =(userData) => userApi.post('/estudiantes/',userData)
// export const createUserDoc =(userData) => userApi.post('/docentes/',userData)


// export default userApi;

import axios from 'axios';

// Crear una instancia de axios sin necesidad de token
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/login/',  // Cambia la URL si es necesario
});

// Función para crear un docente sin autenticación
export const createUserDoc = async (docenteData) => {
  try {
    // Realiza la solicitud POST sin incluir encabezados de autorización
    const response = await api.post('docentes/', docenteData);
    return response.data;
  } catch (error) {
    console.error('Error al crear docente:', error);
    throw error;  // Lanza el error para manejarlo en el componente
  }
};

// Función para crear un estudiante
export const createUserEst = async (estudianteData) => {
  try {
    // Usamos la instancia 'api' para hacer el POST
    const response = await api.post('estudiantes/', estudianteData);
    return response.data;
  } catch (error) {
    console.error('Error al crear estudiante:', error);
    throw error;
  }
};

// Función para crear un usuario
export const createUser = async (userData) => {
  try {
    // Usamos la instancia 'api' para hacer el POST
    const response = await api.post('usuarios/', userData);
    return response.data;
  } catch (error) {
    console.error('Error al crear usuario:', error);
    throw error;
  }
};
