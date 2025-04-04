import axios from 'axios';

const usuariosApi = axios.create({
    baseURL: "http://127.0.0.1:8000/api/usuario/"
})
//llama la constante de arriba
export const getUsuarios = () => usuariosApi.get()
export const getUsuario = (id) => usuariosApi.get(id)
export const createUsuario = (usuario) => usuariosApi.post('/',usuario)