import React from 'react';

export default function Footer() {
  return (
    // <footer className="bg-gray-900 text-white py-6 mt-10">
    <nav className='py-4 mb-2'>
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm text-center md:text-left">
          &copy; {new Date().getFullYear()} Test /x/ — Todos los derechos reservados.
        </p>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a href="#" className="hover:text-blue-400 transition duration-300">Privacidad</a>
          <a href="#" className="hover:text-blue-400 transition duration-300">Términos</a>
          <a href="#" className="hover:text-blue-400 transition duration-300">Contacto</a>
        </div>
      </div>
    </nav>  
    // </footer>
  );
}
