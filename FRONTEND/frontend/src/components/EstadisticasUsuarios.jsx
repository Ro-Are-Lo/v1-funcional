import React from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const EstadisticasUsuarios = ({ usuarios }) => {
  const tipoCounts = usuarios.reduce((acc, u) => {
    acc[u.user_type] = (acc[u.user_type] || 0) + 1;
    return acc;
  }, {});

  const generoCounts = usuarios.reduce((acc, u) => {
    if (u.user_type === 'estudiante' && u.estudiante_profile) {
      const genero = u.estudiante_profile.genero;
      acc[genero] = (acc[genero] || 0) + 1;
    }
    return acc;
  }, {});

  const edadCounts = usuarios.reduce((acc, u) => {
    if (u.user_type === 'estudiante' && u.estudiante_profile?.edad !== undefined) {
      const edad = u.estudiante_profile.edad;
      acc[edad] = (acc[edad] || 0) + 1;
    }
    return acc;
  }, {});

  const anoEscolarCounts = usuarios.reduce((acc, u) => {
    if (u.user_type === 'estudiante' && u.estudiante_profile?.ult_ano_es !== undefined) {
      const ano = u.estudiante_profile.ult_ano_es;
      acc[ano] = (acc[ano] || 0) + 1;
    }
    return acc;
  }, {});

  const carreraACounts = usuarios.reduce((acc, u) => {
    if (u.user_type === 'estudiante' && u.estudiante_profile?.carr_op_A) {
      const carrera = u.estudiante_profile.carr_op_A.trim();
      if (carrera !== '') acc[carrera] = (acc[carrera] || 0) + 1;
    }
    return acc;
  }, {});

  const pieData = {
    labels: Object.keys(tipoCounts),
    datasets: [{
      label: 'Usuarios por tipo',
      data: Object.values(tipoCounts),
      backgroundColor: ['#60A5FA', '#34D399', '#FBBF24'],
    }],
  };

  const barGeneroData = {
    labels: Object.keys(generoCounts),
    datasets: [{
      label: 'Estudiantes por género',
      data: Object.values(generoCounts),
      backgroundColor: ['#818CF8', '#F472B6'],
    }],
  };

  const edadData = {
    labels: Object.keys(edadCounts),
    datasets: [{
      label: 'Estudiantes por Edad',
      data: Object.values(edadCounts),
      backgroundColor: '#60A5FA',
    }],
  };

  const anoEscolarData = {
    labels: Object.keys(anoEscolarCounts),
    datasets: [{
      label: 'Estudiantes por Año Escolar',
      data: Object.values(anoEscolarCounts),
      backgroundColor: '#34D399',
    }],
  };

  const carreraAData = {
    labels: Object.keys(carreraACounts),
    datasets: [{
      label: 'Preferencia Carrera A',
      data: Object.values(carreraACounts),
      backgroundColor: '#FBBF24',
    }],
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-md mt-10">
      <h3 className="text-xl font-semibold text-gray-700 mb-6">Estadísticas de Usuarios</h3>

      {/* Fila 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="w-full h-[300px] break-inside-avoid bg-gray-50 p-4 rounded shadow">
          <Pie data={pieData} />
        </div>
        <div className="w-full h-[300px] break-inside-avoid bg-gray-50 p-4 rounded shadow">
          <Bar data={barGeneroData} />
        </div>
      </div>

      {/* Fila 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="w-full h-[300px] break-inside-avoid bg-gray-50 p-4 rounded shadow">
          <Bar data={edadData} />
        </div>
        <div className="w-full h-[300px] break-inside-avoid bg-gray-50 p-4 rounded shadow">
          <Bar data={anoEscolarData} />
        </div>
      </div>

      {/* Fila 3 */}
      <div className="w-full h-[300px] break-inside-avoid bg-gray-50 p-4 rounded shadow mb-6">
        <Bar data={carreraAData} />
      </div>
    </div>
  );
};

export default EstadisticasUsuarios;
