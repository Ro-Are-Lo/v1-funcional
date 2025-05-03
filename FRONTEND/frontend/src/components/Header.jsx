import React from 'react';  // Asegúrate de importar React
import { Link } from 'react-router-dom'; // También importa 'Link' desde react-router-dom

export default function Header() {
  return (
    <nav className='py-4 mb-2'>
      <div className='container mx-auto flex justify-between items-center'>
        <Link to="/" className='text-4xl font-bold text-blue-950'> Test /x/</Link>
        <div>
          <Link to="/crear-user" className='bg-green-600 text-white px-4 py-2 rounded-lg'>
            log in
          </Link>
          <Link to="/login" className='bg-green-600 text-white px-4 py-2 rounded-lg'>
            sig in 
          </Link >
        </div>
      </div>
    </nav>
  );
}
