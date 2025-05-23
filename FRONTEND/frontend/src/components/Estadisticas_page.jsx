// frontend/src/pages/EstadisticasPage.jsx
import React, { useEffect, useState } from 'react';
import html2pdf from 'html2pdf.js';
import EstadisticasUsuarios from '../components/EstadisticasUsuarios';

function EstadisticasPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (!token) {
      setError('Token no encontrado');
      setLoading(false);
      return;
    }

    fetch('http://127.0.0.1:8000/login/usuarios/completos/', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setUsuarios(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Solución robusta para evitar error de colores "oklch"
 const replaceColors = () => {
    const elements = document.querySelectorAll('*');
    elements.forEach((el) => {
      const style = window.getComputedStyle(el);
      if (style.color.includes('oklch')) el.style.color = 'black';
      if (style.backgroundColor.includes('oklch')) el.style.backgroundColor = 'white';
    });
  };

  const handleExportToPDF = () => {
    const element = document.getElementById('pdf-content');
    if (!element) return alert('No se encontró el contenido para exportar.');

    setIsExporting(true);
    replaceColors();

    html2pdf()
      .set({
        margin: 0.5,
        filename: `usuarios-filtrados-${new Date().toISOString().slice(0, 10)}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
      })
      .from(element)
      .save()
      .then(() => {
        setIsExporting(false);
        alert('PDF generado con éxito!');
      })
      .catch((err) => {
        setIsExporting(false);
        alert(`Error al generar PDF: ${err.message}`);
      });
  };

  const formatFecha = () => {
    const fecha = new Date();
    return fecha.toLocaleString('es-ES');
  };

  const currentUserEmail = localStorage.getItem('current_user_email') || 'Usuario desconocido';

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Reporte de Estadísticas</h1>

      {loading ? (
        <p>Cargando datos...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : (
        <div id="pdf-report" className="bg-white p-6 rounded shadow-md">
          {/* Info del reporte */}
          <div className="mb-6">
            <p><strong>Generado por:</strong> {currentUserEmail}</p>
            <p><strong>Fecha y hora:</strong> {formatFecha()}</p>
            <p><strong>Cantidad de usuarios en el reporte:</strong> {usuarios.length}</p>
          </div>

          {/* Gráficas */}
          <EstadisticasUsuarios usuarios={usuarios} />

          {/* Tabla de datos */}
          <div className="overflow-auto mt-8">
            <table className="min-w-full table-auto border border-gray-300 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-2 py-1">Email</th>
                  <th className="border px-2 py-1">Nombre</th>
                  <th className="border px-2 py-1">Tipo</th>
                  <th className="border px-2 py-1">Edad</th>
                  <th className="border px-2 py-1">Género</th>
                  <th className="border px-2 py-1">Carrera A</th>
                  <th className="border px-2 py-1">Carrera B</th>
                  <th className="border px-2 py-1">Carrera C</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="border px-2 py-1">{u.email}</td>
                    <td className="border px-2 py-1">{u.first_name} {u.last_name}</td>
                    <td className="border px-2 py-1">{u.user_type}</td>
                    <td className="border px-2 py-1">{u.estudiante_profile?.edad ?? 'N/A'}</td>
                    <td className="border px-2 py-1">{u.estudiante_profile?.genero ?? 'N/A'}</td>
                    <td className="border px-2 py-1">{u.estudiante_profile?.carr_op_A ?? 'N/A'}</td>
                    <td className="border px-2 py-1">{u.estudiante_profile?.carr_op_B ?? 'N/A'}</td>
                    <td className="border px-2 py-1">{u.estudiante_profile?.carr_op_C ?? 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Botón Exportar */}
      {!loading && (
         <div className="text-center mt-6">
        <button onClick={handleExportToPDF} className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700" disabled={isExporting}>
          {isExporting ? 'Generando PDF...' : 'Exportar a PDF'}
        </button>
      </div>
      
      )}
    </div>
  );
}

export default EstadisticasPage;
