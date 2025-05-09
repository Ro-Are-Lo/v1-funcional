import React from 'react';
import { Link } from 'react-router-dom';

const SeleccionRol = () => {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-8 text-blue-900">¿Quién eres?</h1>
        <div className="flex justify-center gap-10">
          <Link
            to="/crear-docente"
            className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Soy Docente
          </Link>
          <Link
            to="/crear-estudiante"
            className="px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Soy Estudiante
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SeleccionRol;
