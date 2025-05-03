// src/pages/Home_user_doce.jsx
import { useEffect, useState } from 'react';

function Home_user_doce() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/login/usuarios/', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access')}`,
      },
    })
      .then((res) => {
        if (res.status === 401) throw new Error('No autorizado');
        return res.json();
      })
      .then((data) => setUsuarios(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h2>Usuarios docente </h2>
      <ul>
        {usuarios.map((u) => (
          <li key={u.id}>{u.email} - {u.user_type}- {u.last_name}</li>
        ))}
      </ul>
    </div>
  );
}

export default Home_user_doce;
