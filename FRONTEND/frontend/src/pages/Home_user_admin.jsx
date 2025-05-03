import { useEffect, useState } from 'react';

function Home_user_admin() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);  // Para manejar el estado de carga
  const [error, setError] = useState(null);  // Para manejar los errores

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (!token) {
      setError('No se ha encontrado el token de autenticación. Por favor, inicia sesión.');
      setLoading(false);
      return;
    }

    // Realizar la solicitud solo si el token está presente
    fetch('http://127.0.0.1:8000/login/usuarios/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          // Si el estado no es "ok", lanza un error
          throw new Error(res.status === 401 ? 'No autorizado' : 'Error en la solicitud');
        }
        return res.json(); // Convierte la respuesta en JSON
      })
      .then((data) => {
        setUsuarios(data);  // Establece los datos de los usuarios
        setLoading(false);   // Cambia el estado de carga a "false"
      })
      .catch((err) => {
        setError(err.message);  // Establece el mensaje de error
        setLoading(false);      // Cambia el estado de carga a "false"
      });
  }, []);

  if (loading) {
    return <div>Cargando...</div>;  // Muestra un mensaje de carga mientras se obtienen los usuarios
  }

  if (error) {
    return <div>Error: {error}</div>;  // Muestra el error si ocurre alguno
  }

  return (
    <div>
      <h2>Usuarios admin</h2>
      <ul>
        {usuarios.length === 0 ? (
          <li>No hay usuarios para mostrar.</li>  // Si no hay usuarios, muestra un mensaje
        ) : (
          usuarios.map((u) => (
            <li key={u.id}>
              {u.email} - {u.user_type} - {u.last_name}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default Home_user_admin;
