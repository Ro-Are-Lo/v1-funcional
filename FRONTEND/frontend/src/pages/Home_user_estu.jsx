import { useEffect, useState } from 'react';

function Home_user_estu() {
  const [usuario, setUsuario] = useState(null);
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
    carr_op_A: '',
    carr_op_B: '',
    carr_op_C: '',
  });
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Añadimos el estado para manejar el modo de edición

  useEffect(() => {
    const token = localStorage.getItem('access');

    if (!token) {
      console.error("Token no encontrado en el localStorage.");
      return;
    }

    fetch('http://127.0.0.1:8000/login/estudiantes/perfil/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status === 401) {
          throw new Error('No autorizado');
        }
        return res.json();
      })
      .then((data) => {
        setUsuario(data);
        setFormData({
          email: data.user?.email || '',
          username: data.user?.username || '',
          first_name: data.user?.first_name || '',
          last_name: data.user?.last_name || '',
          last_name2: data.user?.last_name2 || '',
          password: '',
          edad: data.edad ?? '',
          genero: data.genero ?? '',
          ult_ano_es: data.ult_ano_es ?? '',
          carr_op_A: data.carr_op_A ?? '',
          carr_op_B: data.carr_op_B ?? '',
          carr_op_C: data.carr_op_C ?? '',
        });
      })
      .catch((err) => {
        console.error('Error al obtener los datos:', err);
        setError(err.message);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access');

    fetch('http://127.0.0.1:8000/login/estudiantes/perfil/', {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: formData.username,
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        last_name2: formData.last_name2,
        password: formData.password,
        edad: formData.edad,
        genero: formData.genero,
        ult_ano_es: formData.ult_ano_es,
        carr_op_A: formData.carr_op_A,
        carr_op_B: formData.carr_op_B,
        carr_op_C: formData.carr_op_C,
      })
    })
      .then((res) => {
        if (res.status === 401) {
          throw new Error('No autorizado');
        }
        if (!res.ok) {
          throw new Error('Error al actualizar los datos');
        }
        return res.json();
      })
      .then((data) => {
        setUsuario(data);
        console.log('Datos actualizados:', data);
        setIsEditing(false); // Salimos del modo edición
      })
      .catch((err) => {
        console.error('Error al actualizar los datos:', err);
        setError(err.message);
      });
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!usuario) {
    return <div>Cargando...</div>;
  }

  // Vista de solo lectura (ver datos)
  const PerfilView = () => (
    <div>
      <h3><strong>Nombre de Usuario:</strong> {formData.username}</h3>
      <p><strong>Email:</strong> {formData.email}</p>
      <p><strong>Primer Nombre:</strong> {formData.first_name}</p>
      <p><strong>Apellido Paterno:</strong> {formData.last_name}</p>
      <p><strong>Apellido Materno:</strong> {formData.last_name2}</p>
      <p><strong>Edad:</strong> {formData.edad}</p>
      <p><strong>Género:</strong> {formData.genero}</p>
      <p><strong>Último Año Escolar:</strong> {formData.ult_ano_es}</p>
      <p><strong>Carrera Opcional A:</strong> {formData.carr_op_A}</p>
      <p><strong>Carrera Opcional B:</strong> {formData.carr_op_B}</p>
      <p><strong>Carrera Opcional C:</strong> {formData.carr_op_C}</p>
      <button 
        onClick={() => setIsEditing(true)}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
      >
        Editar Perfil
      </button>
    </div>
  );

  // Vista de edición de datos
  const PerfilEdit = () => (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-md shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Editar Perfil</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre de Usuario:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Primer Nombre:</label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Apellido Paterno:</label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Apellido Materno:</label>
          <input
            type="text"
            name="last_name2"
            value={formData.last_name2}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Contraseña:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Edad:</label>
          <input
            type="number"
            name="edad"
            value={formData.edad}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Género:</label>
          <select
            name="genero"
            value={formData.genero}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
            <option value="O">Otro</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Último Año Escolar:</label>
          <input
            type="number"
            name="ult_ano_es"
            value={formData.ult_ano_es}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Carrera Opcional A:</label>
          <input
            type="text"
            name="carr_op_A"
            value={formData.carr_op_A}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Carrera Opcional B:</label>
          <input
            type="text"
            name="carr_op_B"
            value={formData.carr_op_B}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Carrera Opcional C:</label>
          <input
            type="text"
            name="carr_op_C"
            value={formData.carr_op_C}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="text-center">
          <button
            type="submit"
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Actualizar Perfil
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-md shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        {isEditing ? 'Editar Perfil' : 'Ver Perfil'}
      </h2>
      {isEditing ? <PerfilEdit /> : <PerfilView />}
    </div>
  );
}

export default Home_user_estu;


// // src/pages/Home_user_estu.jsx
// import { useEffect, useState } from 'react';

// function Home_user_estu() {
//   const [usuario, setUsuario] = useState(null);

//   useEffect(() => {
//     // Obtener los datos del usuario autenticado
//     fetch('http://127.0.0.1:8000/login/usuarios/', {  // Este endpoint debería devolver los datos del usuario autenticado
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem('access')}`,  // Usar el token de acceso almacenado
//       },
//     })
//       .then((res) => {
//         if (res.status === 401) throw new Error('No autorizado');
//         return res.json();
//       })
//       .then((data) => setUsuario(data))  // Guardar los datos del usuario en el estado
//       .catch((err) => console.error(err));
//   }, []);  // Ejecutar una vez al cargar el componente

//   if (!usuario) {
//     return <div>Cargando...</div>;  // Mostrar un mensaje de carga mientras se obtiene la información
//   }

//   return (
//     <div>
//       <h2>Datos del usuario</h2>
//       <p>Email: {usuario.email}</p>
//       <p>Tipo de usuario: {usuario.user_type}</p>
//       <p>Apellido: {usuario.last_name}</p>
//       {/* Puedes agregar más campos según los datos que te retorne la API */}
//     </div>
//   );
// }

// export default Home_user_estu;
