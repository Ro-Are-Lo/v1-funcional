
//crear los campos de ingreasr los datos para crear a los usaurios 
// en const usuario y handel lo que ahcer es llamar y lleanr datos por djnago
//el imput debe esat asosiado con el state para capturar lo datos uq ingresemos en el formulario
import { useEffect, useState } from "react";
import { createUsuario, getUsuario } from "../api/usuarios.js";
import {useNavigate, useParams} from "react-router"

export default function UsuarioForm() {
  const [usuario, setUsuario] = useState({
    idusuario: "",
    password: "",
    tipoderol: ""
  });
    const navigate = useNavigate();
    const params = useParams()

    useEffect(() => {
        const loadUsuario = async () => {
            if(params.id){
                const response = await getUsuario(params.id)
                setUsuario(response.data)
            }
        }
        loadUsuario()
    }, [params.id])

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Verifica que el objeto usuario esté correctamente formateado antes de enviarlo
    await createUsuario(usuario);
    navigate("/");
  };
 
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-700">Usuario</label>
          <input
            type="text"
            value={usuario.idusuario} // Aquí asignamos el valor del estado
            onChange={(e) =>
                setUsuario({ ...usuario, idusuario: e.target.value }) // Corregido para actualizar el campo idusuario
            
            }
          

            className="w-full mt-1 p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-700">Password</label>
          <input
            type="password"
            value={usuario.password} // Aquí asignamos el valor del estado
            onChange={(e) =>
              setUsuario({ ...usuario, password: e.target.value }) // Corregido para actualizar el campo password
            }
            className="w-full mt-1 p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-700">Rol</label>
          <input
            type="text"
            value={usuario.tipoderol} // Aquí asignamos el valor del estado
            onChange={(e) =>
              setUsuario({ ...usuario, tipoderol: e.target.value }) // Corregido para actualizar el campo tipoderol
            }
            className="w-full mt-1 p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <button className="bg-green-500 text-white px-4 py-2 rounded-lg">Guardar</button>
          <button className="bg-red-500 text-white px-4 py-2 rounded-lg ml-2">Cancelar</button>
        </div>
      </form>
    </div>
  );
}
