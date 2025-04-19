import React from 'react';  // Asegúrate de importar React
import { Link } from 'react-router-dom'; // También importa 'Link' desde react-router-dom
import { useState,useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
// import { createUser } from '../Api/api';
import imgBody from '../assets/img-standar/img-1.png';



export default function IniciarTest(){
    return (
        <div>
        <header className="bg-gray-100 py-6 mb-6">
          {/* Texto superior */}
          <h1 className="text-center text-2xl md:text-3xl font-semibold text-gray-800 mb-6">
            Descubre la carrera o profesión que es perfecta para ti
          </h1>
    
          {/* Contenedor principal */}
          <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4 gap-4">
            {/* Botón a la izquierda */}
            <Link
              to="/usuario-est"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium text-lg"
            >
              Iniciar Test
            </Link>
    
            {/* Imagen a la derecha */}
            <img
              src={imgBody}
              alt="Test ilustración"
              className="w-full md:w-1/2 max-w-md object-contain"
            />
          </div>
        </header>
        </div>
      );

}