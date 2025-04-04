//imporatmos el export gerUsarios de usuarios.js
import { useEffect, useState } from "react"
import { getUsuarios } from "../api/usuarios"
import {useNavigate} from "react-router"

export default function UsuarioList(){
    
    const [usuarios,setUsuarios] = useState([])
    
    const navigate = useNavigate()
    
    const loadUsuarios = async() =>{
        //permite obtener los datos de la api
        const response = await getUsuarios();
        setUsuarios(response.data)
    }
    //cargara los datos 
    useEffect (() => {
        loadUsuarios()
    }, [])

    return(
        <div className="mt-8">
            <h1 className="text-3xl font-bold text-sky-900">usuarios disponibles</h1>
            <div className="grid-cols-1 md:grid-cols-3 mt-5 gap-5 text-white">
                
                {usuarios.map(usuarios =>
                    <div key={usuarios.id} className="bg-sky-900 p- rounded-lg shadow">
                       
                        <p><span className="font-bold ml-2">Usuario: </span> {usuarios.idusuario}</p>
                        <p><span className="font-bol ml-2">Password: </span>{usuarios.password}</p>
                        <p><span className="font-bold ml-2">Rol: </span> {usuarios.tipoderol}</p>
                            <div className="mt-4"> 
                                <button 
                                className="bg-green-600 text-white px-2 py-1 rounded-lg ml-2"
                                onClick={() => navigate('/editar-usuario/' + usuarios.id)}
                                >
                                    Editar
                                </button>
                                <button className="bg-green-600 text-white px-2 py-1 rounded-lg ml-2">Guardar</button>                    
                            </div>
                    </div>
                )}
                
            </div>
        </div>
    )
}