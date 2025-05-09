import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home_user_admin() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filtros
  const [filter, setFilter] = useState({
    tipoUsuario: '',
    genero: '',
    edadMin: '',
    edadMax: '',
    anoEscolarMin: '',
    anoEscolarMax: '',
  });

  const navigate = useNavigate();

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    navigate('/login'); // Redirige al login después de cerrar sesión
  };

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (!token) {
      setError('No se ha encontrado el token de autenticación. Por favor, inicia sesión.');
      setLoading(false);
      return;
    }

    fetch('http://127.0.0.1:8000/login/usuarios/completos/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.status === 401 ? 'No autorizado' : 'Error en la solicitud');
        }
        return res.json();
      })
      .then((data) => {
        // Asegurarse de que siempre sea un array
        if (Array.isArray(data)) {
          setUsuarios(data);
        } else {
          setUsuarios([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Filtrar usuarios
  const filterUsuarios = (usuarios) => {
    return usuarios.filter((u) => {
      // Filtrar por tipo de usuario
      if (filter.tipoUsuario && u.user_type !== filter.tipoUsuario) return false;

      // Filtrar por género
      if (filter.genero && u.estudiante_profile && u.estudiante_profile.genero !== filter.genero) return false;

      // Filtrar por edad
      if (
        (filter.edadMin && u.estudiante_profile && u.estudiante_profile.edad < filter.edadMin) ||
        (filter.edadMax && u.estudiante_profile && u.estudiante_profile.edad > filter.edadMax)
      ) {
        return false;
      }

      // Filtrar por año escolar
      if (
        (filter.anoEscolarMin && u.estudiante_profile && u.estudiante_profile.ult_ano_es < filter.anoEscolarMin) ||
        (filter.anoEscolarMax && u.estudiante_profile && u.estudiante_profile.ult_ano_es > filter.anoEscolarMax)
      ) {
        return false;
      }

      return true;
    });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prevFilter) => ({
      ...prevFilter,
      [name]: value,
    }));
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  const filteredUsuarios = filterUsuarios(usuarios);

  return (
    <div className="p-5">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Usuarios Admin</h2>
  
      {/* Filtros */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Filtros de Búsqueda</h3>
  
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-600 w-1/4">Tipo de Usuario:</label>
            <select name="tipoUsuario" onChange={handleFilterChange} value={filter.tipoUsuario} className="border p-2 rounded-md w-3/4 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400">
              <option value="">Todos</option>
              <option value="admin">Admin</option>
              <option value="estudiante">Estudiante</option>
              <option value="docente">Docente</option>
            </select>
          </div>
  
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-600 w-1/4">Género:</label>
            <select name="genero" onChange={handleFilterChange} value={filter.genero} className="border p-2 rounded-md w-3/4 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400">
              <option value="">Todos</option>
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
            </select>
          </div>
  
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-600 w-1/4">Edad Mínima:</label>
            <input
              type="number"
              name="edadMin"
              value={filter.edadMin}
              onChange={handleFilterChange}
              placeholder="Edad mínima"
              className="border p-2 rounded-md w-3/4 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
  
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-600 w-1/4">Edad Máxima:</label>
            <input
              type="number"
              name="edadMax"
              value={filter.edadMax}
              onChange={handleFilterChange}
              placeholder="Edad máxima"
              className="border p-2 rounded-md w-3/4 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
  
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-600 w-1/4">Año Escolar Mínimo:</label>
            <input
              type="number"
              name="anoEscolarMin"
              value={filter.anoEscolarMin}
              onChange={handleFilterChange}
              placeholder="Año escolar mínimo"
              className="border p-2 rounded-md w-3/4 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
  
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-600 w-1/4">Año Escolar Máximo:</label>
            <input
              type="number"
              name="anoEscolarMax"
              value={filter.anoEscolarMax}
              onChange={handleFilterChange}
              placeholder="Año escolar máximo"
              className="border p-2 rounded-md w-3/4 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>
      </div>
  
      {/* Mostrar los usuarios filtrados */}
      <ul className="space-y-4">
        {filteredUsuarios.length === 0 ? (
          <li className="text-center text-gray-600">No hay usuarios para mostrar.</li>
        ) : (
          filteredUsuarios.map((u) => (
            <li key={u.id} className="p-4 border rounded-md bg-white shadow-md hover:shadow-lg transition">
              <div className="space-y-2">
                <div><strong className="text-gray-700">Email:</strong> {u.email}</div>
                <div><strong className="text-gray-700">Username:</strong> {u.username}</div>
                <div><strong className="text-gray-700">Tipo de Usuario:</strong> {u.user_type}</div>
                <div><strong className="text-gray-700">Nombre:</strong> {u.first_name} {u.last_name} {u.last_name2}</div>
                <div><strong className="text-gray-700">Estado:</strong> {u.is_active ? 'Activo' : 'Inactivo'}</div>
  
                {u.user_type === 'estudiante' && u.estudiante_profile && (
                  <div className="mt-2">
                    <div><strong className="text-gray-700">Edad:</strong> {u.estudiante_profile.edad}</div>
                    <div><strong className="text-gray-700">Género:</strong> {u.estudiante_profile.genero}</div>
                    <div><strong className="text-gray-700">Último año escolar:</strong> {u.estudiante_profile.ult_ano_es}</div>
                  </div>
                )}
  
                {u.user_type === 'docente' && u.docente_profile && (
                  <div className="mt-2">
                    <div><strong className="text-gray-700">Institución:</strong> {u.docente_profile.institucion}</div>
                    <div><strong className="text-gray-700">Licenciatura:</strong> {u.docente_profile.licenciatura}</div>
                  </div>
                )}
              </div>
            </li>
          ))
        )}
      </ul>
  
      {/* Botón de cerrar sesión */}
      <div className="mt-8 text-center">
        <button
          onClick={handleLogout}
          className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition focus:outline-none"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

export default Home_user_admin;


//--------------------------------------------------------------------------------------------------
/// ultima verion funcional

// import React, { useEffect, useState } from 'react';

// function Home_user_admin() {
//   const [usuarios, setUsuarios] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Filtros
//   const [filter, setFilter] = useState({
//     tipoUsuario: '',
//     genero: '',
//     edadMin: '',
//     edadMax: '',
//     anoEscolarMin: '',
//     anoEscolarMax: '',
//   });

//   useEffect(() => {
//     const token = localStorage.getItem('access');
//     if (!token) {
//       setError('No se ha encontrado el token de autenticación. Por favor, inicia sesión.');
//       setLoading(false);
//       return;
//     }

//     fetch('http://127.0.0.1:8000/login/usuarios/completos/', {
//       method: 'GET',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//     })
//       .then((res) => {
//         if (!res.ok) {
//           throw new Error(res.status === 401 ? 'No autorizado' : 'Error en la solicitud');
//         }
//         return res.json();
//       })
//       .then((data) => {
//         // Asegurarse de que siempre sea un array
//         if (Array.isArray(data)) {
//           setUsuarios(data);
//         } else {
//           setUsuarios([]);
//         }
//         setLoading(false);
//       })
//       .catch((err) => {
//         setError(err.message);
//         setLoading(false);
//       });
//   }, []);

//   // Filtrar usuarios
//   const filterUsuarios = (usuarios) => {
//     return usuarios.filter((u) => {
//       // Filtrar por tipo de usuario
//       if (filter.tipoUsuario && u.user_type !== filter.tipoUsuario) return false;

//       // Filtrar por género
//       if (filter.genero && u.estudiante_profile && u.estudiante_profile.genero !== filter.genero) return false;

//       // Filtrar por edad
//       if (
//         (filter.edadMin && u.estudiante_profile && u.estudiante_profile.edad < filter.edadMin) ||
//         (filter.edadMax && u.estudiante_profile && u.estudiante_profile.edad > filter.edadMax)
//       ) {
//         return false;
//       }

//       // Filtrar por año escolar
//       if (
//         (filter.anoEscolarMin && u.estudiante_profile && u.estudiante_profile.ult_ano_es < filter.anoEscolarMin) ||
//         (filter.anoEscolarMax && u.estudiante_profile && u.estudiante_profile.ult_ano_es > filter.anoEscolarMax)
//       ) {
//         return false;
//       }

//       return true;
//     });
//   };

//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilter((prevFilter) => ({
//       ...prevFilter,
//       [name]: value,
//     }));
//   };

//   if (loading) return <div>Cargando...</div>;
//   if (error) return <div>Error: {error}</div>;

//   const filteredUsuarios = filterUsuarios(usuarios);

//   return (
//     <div className="p-5">
//       <h2 className="text-2xl font-bold mb-4">Usuarios Admin</h2>

//       {/* Filtros */}
//       <div className="mb-4">
//         <div>
//           <label className="mr-2">Tipo de Usuario:</label>
//           <select name="tipoUsuario" onChange={handleFilterChange} value={filter.tipoUsuario}>
//             <option value="">Todos</option>
//             <option value="admin">Admin</option>
//             <option value="estudiante">Estudiante</option>
//             <option value="docente">Docente</option>
//           </select>
//         </div>

//         <div>
//           <label className="mr-2">Género:</label>
//           <select name="genero" onChange={handleFilterChange} value={filter.genero}>
//             <option value="">Todos</option>
//             <option value="M">Masculino</option>
//             <option value="F">Femenino</option>
//           </select>
//         </div>

//         <div>
//           <label className="mr-2">Edad Mínima:</label>
//           <input
//             type="number"
//             name="edadMin"
//             value={filter.edadMin}
//             onChange={handleFilterChange}
//             placeholder="Edad mínima"
//             className="border p-2"
//           />
//         </div>

//         <div>
//           <label className="mr-2">Edad Máxima:</label>
//           <input
//             type="number"
//             name="edadMax"
//             value={filter.edadMax}
//             onChange={handleFilterChange}
//             placeholder="Edad máxima"
//             className="border p-2"
//           />
//         </div>

//         <div>
//           <label className="mr-2">Año Escolar Mínimo:</label>
//           <input
//             type="number"
//             name="anoEscolarMin"
//             value={filter.anoEscolarMin}
//             onChange={handleFilterChange}
//             placeholder="Año escolar mínimo"
//             className="border p-2"
//           />
//         </div>

//         <div>
//           <label className="mr-2">Año Escolar Máximo:</label>
//           <input
//             type="number"
//             name="anoEscolarMax"
//             value={filter.anoEscolarMax}
//             onChange={handleFilterChange}
//             placeholder="Año escolar máximo"
//             className="border p-2"
//           />
//         </div>
//       </div>

//       {/* Mostrar los usuarios filtrados */}
//       <ul className="space-y-2">
//         {filteredUsuarios.length === 0 ? (
//           <li>No hay usuarios para mostrar.</li>
//         ) : (
//           filteredUsuarios.map((u) => (
//             <li key={u.id} className="p-4 border rounded-md bg-white shadow">
//               <div><strong>Email:</strong> {u.email}</div>
//               <div><strong>Username:</strong> {u.username}</div>
//               <div><strong>Tipo de Usuario:</strong> {u.user_type}</div>
//               <div><strong>Nombre:</strong> {u.first_name} {u.last_name} {u.last_name2}</div>
//               <div><strong>Estado:</strong> {u.is_active ? 'Activo' : 'Inactivo'}</div>

//               {u.user_type === 'estudiante' && u.estudiante_profile && (
//                 <div className="mt-2">
//                   <div><strong>Edad:</strong> {u.estudiante_profile.edad}</div>
//                   <div><strong>Género:</strong> {u.estudiante_profile.genero}</div>
//                   <div><strong>Último año escolar:</strong> {u.estudiante_profile.ult_ano_es}</div>
//                 </div>
//               )}

//               {u.user_type === 'docente' && u.docente_profile && (
//                 <div className="mt-2">
//                   <div><strong>Institución:</strong> {u.docente_profile.institucion}</div>
//                   <div><strong>Licenciatura:</strong> {u.docente_profile.licenciatura}</div>
//                 </div>
//               )}
//             </li>
//           ))
//         )}
//       </ul>
//     </div>
//   );
// }

// export default Home_user_admin;










//--------------------------------------------------------------------------------------------------------------------------
// import React, { useEffect, useState } from 'react';

// function Home_user_admin() {
//   const [usuarios, setUsuarios] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const token = localStorage.getItem('access');
//     if (!token) {
//       setError('No se ha encontrado el token de autenticación. Por favor, inicia sesión.');
//       setLoading(false);
//       return;
//     }

//     fetch('http://127.0.0.1:8000/login/usuarios/completos/', {
//       method: 'GET',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//     })
//       .then((res) => {
//         if (!res.ok) {
//           throw new Error(res.status === 401 ? 'No autorizado' : 'Error en la solicitud');
//         }
//         return res.json();
//       })
//       .then((data) => {
//         // Asegurarse de que siempre sea un array
//         if (Array.isArray(data)) {
//           setUsuarios(data);
//         } else {
//           setUsuarios([]); // o puedes lanzar error
//         }
//         setLoading(false);
//       })
//       .catch((err) => {
//         setError(err.message);
//         setLoading(false);
//       });
//   }, []);

//   if (loading) return <div>Cargando...</div>;
//   if (error) return <div>Error: {error}</div>;

//   return (
//     <div className="p-5">
//       <h2 className="text-2xl font-bold mb-4">Usuarios Admin</h2>
//       <ul className="space-y-2">
//         {usuarios.length === 0 ? (
//           <li>No hay usuarios para mostrar.</li>
//         ) : (
//           usuarios.map((u) => (
//             <li key={u.id} className="p-4 border rounded-md bg-white shadow">
//               <div><strong>Email:</strong> {u.email}</div>
//               <div><strong>Username:</strong> {u.username}</div>
//               <div><strong>Tipo de Usuario:</strong> {u.user_type}</div>
//               <div><strong>Nombre:</strong> {u.first_name} {u.last_name} {u.last_name2}</div>
//               <div><strong>Estado:</strong> {u.is_active ? 'Activo' : 'Inactivo'}</div>

//               {u.user_type === 'estudiante' && u.estudiante_profile && (
//                 <div className="mt-2">
//                   <div><strong>Edad:</strong> {u.estudiante_profile.edad}</div>
//                   <div><strong>Género:</strong> {u.estudiante_profile.genero}</div>
//                   <div><strong>Último año escolar:</strong> {u.estudiante_profile.ult_ano_es}</div>
//                 </div>
//               )}

//               {u.user_type === 'docente' && u.docente_profile && (
//                 <div className="mt-2">
//                   <div><strong>Institución:</strong> {u.docente_profile.institucion}</div>
//                   <div><strong>Licenciatura:</strong> {u.docente_profile.licenciatura}</div>
//                 </div>
//               )}
//             </li>
//           ))
//         )}
//       </ul>
//     </div>
//   );
// }

// export default Home_user_admin;

// import { useEffect, useState } from 'react';

// function Home_user_admin() {
//   const [usuarios, setUsuarios] = useState([]);
//   const [loading, setLoading] = useState(true);  // Para manejar el estado de carga
//   const [error, setError] = useState(null);  // Para manejar los errores
//   const [searchTerm, setSearchTerm] = useState('');  // Para la búsqueda
//   const [filterType, setFilterType] = useState(''); // Para filtrar por tipo de usuario

//   useEffect(() => {
//     const token = localStorage.getItem('access');
//     if (!token) {
//       setError('No se ha encontrado el token de autenticación. Por favor, inicia sesión.');
//       setLoading(false);
//       return;
//     }

//     // Realizar la solicitud solo si el token está presente
//     fetch('http://127.0.0.1:8000/login/usuarios/', {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     })
//       .then((res) => {
//         if (!res.ok) {
//           // Si el estado no es "ok", lanza un error
//           throw new Error(res.status === 401 ? 'No autorizado' : 'Error en la solicitud');
//         }
//         return res.json(); // Convierte la respuesta en JSON
//       })
//       .then((data) => {
//         setUsuarios(data);  // Establece los datos de los usuarios
//         setLoading(false);   // Cambia el estado de carga a "false"
//       })
//       .catch((err) => {
//         setError(err.message);  // Establece el mensaje de error
//         setLoading(false);      // Cambia el estado de carga a "false"
//       });
//   }, []);

//   // Filtrado de usuarios por búsqueda y tipo
//   const filteredUsers = usuarios.filter((u) => {
//     const matchesSearch =
//       u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       u.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       u.last_name.toLowerCase().includes(searchTerm.toLowerCase());

//     const matchesType = filterType === '' || u.user_type === filterType;

//     return matchesSearch && matchesType;
//   });

//   if (loading) {
//     return <div>Cargando...</div>;  // Muestra un mensaje de carga mientras se obtienen los usuarios
//   }

//   if (error) {
//     return <div>Error: {error}</div>;  // Muestra el error si ocurre alguno
//   }

//   return (
//     <div className="p-5">
//       <h2 className="text-2xl font-bold mb-4">Usuarios Admin</h2>

//       {/* Barra de búsqueda */}
//       <div className="mb-4">
//         <input
//           type="text"
//           placeholder="Buscar por nombre, email, etc."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="border px-4 py-2 rounded-md w-1/3"
//         />

//         {/* Filtro por tipo de usuario */}
//         <select
//           value={filterType}
//           onChange={(e) => setFilterType(e.target.value)}
//           className="border px-4 py-2 rounded-md ml-4 w-1/4"
//         >
//           <option value="">Todos</option>
//           <option value="admin">Admin</option>
//           <option value="estudiante">Estudiante</option>
//           <option value="docente">Docente</option>
//         </select>
//       </div>

//       {/* Lista de usuarios */}
//       <ul className="space-y-2">
//         {filteredUsers.length === 0 ? (
//           <li>No hay usuarios que coincidan.</li>  // Si no hay usuarios, muestra un mensaje
//         ) : (
//           filteredUsers.map((u) => (
//             <li key={u.id} className="p-4 border rounded-md">
//               <div><strong>Email:</strong> {u.email}</div>
//               <div><strong>Username:</strong> {u.username}</div>
//               <div><strong>Tipo de Usuario:</strong> {u.user_type}</div>
//               <div><strong>Nombre:</strong> {u.first_name} </div>
//               <div><strong>Apellido Paterno:</strong>  {u.last_name} </div>
//               <div><strong>Nombre Materno:</strong> {u.last_name2}</div>
//               <div><strong>Edad:</strong> {u.edad}</div>
//             </li>
//           ))
//         )}
//       </ul>
//     </div>
//   );
// }

// export default Home_user_admin;




// import { useEffect, useState } from 'react';

// function Home_user_admin() {
//   const [usuarios, setUsuarios] = useState([]);
//   const [loading, setLoading] = useState(true);  // Para manejar el estado de carga
//   const [error, setError] = useState(null);  // Para manejar los errores

//   useEffect(() => {
//     const token = localStorage.getItem('access');
//     if (!token) {
//       setError('No se ha encontrado el token de autenticación. Por favor, inicia sesión.');
//       setLoading(false);
//       return;
//     }

//     // Realizar la solicitud solo si el token está presente
//     fetch('http://127.0.0.1:8000/login/usuarios/', {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     })
//       .then((res) => {
//         if (!res.ok) {
//           // Si el estado no es "ok", lanza un error
//           throw new Error(res.status === 401 ? 'No autorizado' : 'Error en la solicitud');
//         }
//         return res.json(); // Convierte la respuesta en JSON
//       })
//       .then((data) => {
//         setUsuarios(data);  // Establece los datos de los usuarios
//         setLoading(false);   // Cambia el estado de carga a "false"
//       })
//       .catch((err) => {
//         setError(err.message);  // Establece el mensaje de error
//         setLoading(false);      // Cambia el estado de carga a "false"
//       });
//   }, []);

//   if (loading) {
//     return <div>Cargando...</div>;  // Muestra un mensaje de carga mientras se obtienen los usuarios
//   }

//   if (error) {
//     return <div>Error: {error}</div>;  // Muestra el error si ocurre alguno
//   }


  
//     // username: '',
//     // first_name: '',
//     // last_name: '',
//     // last_name2: '',
//     // password: '',
//     // edad: '',
//     // genero: '',
//     // ult_ano_es: '',  

//   return (
//     <div>
//       <h2>Usuarios admin</h2>
//       <ul>
//         {usuarios.length === 0 ? (
//           <li>No hay usuarios para mostrar.</li>  // Si no hay usuarios, muestra un mensaje
//         ) : (
//           usuarios.map((u) => (
//             <li key={u.id}>
//               {u.email} - {u.username} -{u.user_type} - {u.first_name}  - {u.last_name} - {u.last_name2} 
//             </li>
//           ))
//         )}
//       </ul>
//     </div>
//   );
// }

// export default Home_user_admin;
