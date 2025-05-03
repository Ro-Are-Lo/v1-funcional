import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SelectorPreguntas() {
  const [preguntasPorMateria, setPreguntasPorMateria] = useState({});
  const [respuestas, setRespuestas] = useState({});
  const [materiaActiva, setMateriaActiva] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [usuarioAutenticado, setUsuarioAutenticado] = useState(false);
  const [token, setToken] = useState(null);

  const navigate = useNavigate();

  // Verificar si el usuario está autenticado al cargar el componente
  useEffect(() => {
    const storedToken = localStorage.getItem('access');
    if (storedToken) {
      setToken(storedToken);
      setUsuarioAutenticado(true);
    } else {
      setUsuarioAutenticado(false);
      navigate('/login'); // Redirige a login si no está autenticado
    }
  }, [navigate]);

  // Agrupar las preguntas por materia
  const agruparPorMateria = (preguntas) => {
    const agrupadas = {};
    preguntas.forEach((p) => {
      if (!agrupadas[p.materia]) {
        agrupadas[p.materia] = [];
      }
      agrupadas[p.materia].push(p);
    });
    return agrupadas;
  };

  // Fetch de preguntas al cargar el componente (solo si está autenticado)
  useEffect(() => {
    if (!usuarioAutenticado || !token) return;

    fetch('http://127.0.0.1:8000/test/preguntas/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const agrupadas = agruparPorMateria(data);
        setPreguntasPorMateria(agrupadas);
        const materias = Object.keys(agrupadas);
        if (materias.length > 0) {
          setMateriaActiva(materias[0]);
        }
      })
      .catch((err) => console.error('Error cargando preguntas:', err));
  }, [usuarioAutenticado, token]);

  // Manejar el cambio de respuestas
  const handleChange = (id, respuesta) => {
    setRespuestas((prev) => {
      const newRespuestas = { ...prev, [id]: respuesta };
      localStorage.setItem('respuestas', JSON.stringify(newRespuestas));
      return newRespuestas;
    });
  };

  // Manejar el envío de respuestas
  const handleSubmit = async () => {
    if (!materiaActiva) return;

    if (!usuarioAutenticado || !token) {
      alert('Debes iniciar sesión para enviar tus respuestas.');
      navigate('/login'); // Redirige al login si no está autenticado
      return;
    }

    const respuestasFiltradas = preguntasPorMateria[materiaActiva]
      .filter((p) => respuestas[p.id])
      .map((p) => ({
        id: p.id,
        respuesta: respuestas[p.id],
      }));

    const payload = {
      materia: materiaActiva,
      respuestas: respuestasFiltradas,
    };

    try {
      const res = await fetch('http://127.0.0.1:8000/test/evaluar-respuestas/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,

        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setResultado(data);
      } else {
        console.error('Error al evaluar respuestas', data);
        alert(`Error al evaluar las respuestas: ${data.error || 'Por favor intente nuevamente.'}`);
      }
    } catch (err) {
      console.error('Error al enviar respuestas:', err);
      alert('Ocurrió un error al enviar las respuestas. Inténtalo de nuevo.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4 border rounded shadow-sm bg-white">
      <h1 className="text-2xl font-bold mb-6 text-center">Responde las preguntas</h1>
      
      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        {Object.keys(preguntasPorMateria).map((materia) => (
          <button
            key={materia}
            onClick={() => setMateriaActiva(materia)}
            className={`px-4 py-2 rounded border ${materia === materiaActiva ? "bg-blue-600 text-white" : "bg-white text-blue-600 border-blue-600"}`}
          >
            {materia}
          </button>
        ))}
      </div>

      {materiaActiva && preguntasPorMateria[materiaActiva] && (
        <div>
          <h2 className="text-xl font-semibold text-blue-700 mb-4">{materiaActiva}</h2>
          {preguntasPorMateria[materiaActiva].map((pregunta, index) => (
            <div key={pregunta.id} className="mb-6">
              <p className="font-medium">{index + 1}. {pregunta.pregunta}</p>
              <div className="space-y-1 mt-2">
                {["A", "B", "C"].map((opcion) => (
                  <label key={opcion} className="block">
                    <input
                      type="radio"
                      name={`pregunta-${pregunta.id}`}
                      value={opcion}
                      onChange={() => handleChange(pregunta.id, opcion)}
                      checked={respuestas[pregunta.id] === opcion}
                      className="mr-2"
                    />
                    {pregunta[`op${opcion.toLowerCase()}`]}
                  </label>
                ))}
              </div>
            </div>
          ))}
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 block mx-auto"
          >
            Evaluar respuestas
          </button>
        </div>
      )}

      {resultado && resultado.recomendacion && (
        <div className="mt-6 bg-green-100 p-4 rounded text-left">
          <p className="font-semibold">Correctas: {resultado.correctas}</p>
          <p className="font-semibold mt-2">Carreras recomendadas:</p>
          <ul className="list-disc list-inside text-sm">
            {resultado.recomendacion
              .replace("Te recomendamos las siguientes carreras:", "")
              .split(",")
              .map((carrera, index) => (
                <li key={index}>{carrera.trim()}</li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}
