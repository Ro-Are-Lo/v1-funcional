import axios from 'axios';

// Base de tu backend (ajustalo si cambia)
const userApi = axios.create({
  baseURL: 'http://127.0.0.1:8000/login/usuarios/',
});

// Ejemplo para crear usuario
export const createUser = (userData) => userApi.post('/', userData);
export const createUserEst =(userData) => userApi.post('/usuario-est',userData)
export default userApi;