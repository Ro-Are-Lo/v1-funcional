import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SelectorPreguntas() {
  const [preguntasPorMateria, setPreguntasPorMateria] = useState({});
  const [respuestas, setRespuestas] = useState({});
  const [materiaActiva, setMateriaActiva] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [usuarioAutenticado, setUsuarioAutenticado] = useState(false);
  const [token, setToken] = useState(null);
  const [resultadosPorMateria, setResultadosPorMateria] = useState({});

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
  // Manejar el envío de respuestas
  const handleSubmit = async () => {
  if (!materiaActiva) return;

  if (!usuarioAutenticado || !token) {
    alert('Debes iniciar sesión para enviar tus respuestas.');
    navigate('/login');
    return;
  }

  // Mapeo de letras a campos de opción
  const letraAOpcion = {
    A: 'opa',
    B: 'opb',
    C: 'opc',
    D: 'opd'
  };

  // Convertir las letras seleccionadas en respuestas reales (texto)
  const respuestasFiltradas = preguntasPorMateria[materiaActiva]
    .filter((p) => respuestas[p.id])
    .map((p) => {
      const letraSeleccionada = respuestas[p.id]; // A, B, C o D
      const campoOpcion = letraAOpcion[letraSeleccionada];
      const textoRespuesta = p[campoOpcion]; // valor tipo "base × altura", etc.

      return {
        id: p.id,
        respuesta: textoRespuesta
      };
    });

  const payload = {
    materia: materiaActiva.toLowerCase(), // aseguramos que sea lowercase
    respuestas: respuestasFiltradas
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
    console.log('Respuesta del backend:', data);

    if (res.ok) {
      setResultadosPorMateria((prev) => ({
        ...prev,
        [materiaActiva]: data,
      }));
    } else {
      console.error('Error al evaluar respuestas', data);
      alert(`Error: ${data.error || 'Intenta de nuevo.'}`);
    }
  } catch (err) {
    console.error('Error al enviar respuestas:', err);
    alert('Ocurrió un error. Inténtalo de nuevo.');
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
                {["A", "B", "C","D"].map((opcion) => (
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

      {Object.entries(resultadosPorMateria).map(([materia, resultado]) => (
        <div key={materia} className="mt-6 bg-green-100 p-4 rounded text-left shadow">
          <p className="font-semibold text-green-800">📘 Materia: {materia}</p>
          <p className="font-semibold text-green-800">✅ Correctas: {resultado.correctas}</p>
          
          {resultado.recomendacion && (
          <div className="mt-3">
            {resultado.recomendacion.includes("carreras:") ? (
              <>
                <p className="font-semibold text-green-800">🎓 Carreras recomendadas:</p>
                <ul className="list-disc list-inside text-sm text-green-900 mt-2">
                  {resultado.recomendacion
                    .replace("Te recomendamos las siguientes carreras:", "")
                    .split(",")
                    .map((carrera, index) => (
                      <li key={index}>{carrera.trim()}</li>
                    ))}
                </ul>
              </>
            ) : (
              <p className="text-sm text-red-700 font-medium">{resultado.recomendacion}</p>
            )}
          </div>
          )}




        </div>
      ))}

      {Object.keys(resultadosPorMateria).length > 0 && (
        <div className="mt-10 bg-blue-50 p-4 rounded shadow text-blue-900">
          <h3 className="text-lg font-bold mb-2">📊 Resumen General del Test</h3>
          <p><strong>Materias evaluadas:</strong> {Object.keys(resultadosPorMateria).length}</p>
          <p>
            <strong>Total de respuestas correctas:</strong>{" "}
            {Object.values(resultadosPorMateria).reduce((sum, res) => sum + (res.correctas || 0), 0)}
          </p>
          <div className="mt-3">
            <p className="font-semibold">🎓 Carreras sugeridas (sin repetir):</p>
            <ul className="list-disc list-inside text-sm mt-1">
              {[...new Set(
                Object.values(resultadosPorMateria)
                  .flatMap((res) =>
                    res.recomendacion
                      ?.replace("Te recomendamos las siguientes carreras:", "")
                      .split(",")
                      .map((c) => c.trim()) || []
                  )
              )].map((carrera, index) => (
                <li key={index}>{carrera}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
