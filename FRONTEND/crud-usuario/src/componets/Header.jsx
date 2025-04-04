import {Link} from 'react-router';
export default function Header(){
    return (
        <nav className=" py-4 mb-2">
            <div className='container mx-auto flex justify-between items-center'>
                <Link to="/" className='text-4xl font-bold text-blue-950'> Usuarios App</Link>
                <div>
                <Link to="/usuarios-nuevos" className='bg-green-600 text-white px-4 py-2 rounded-lg'>Crear Usuario Nuevo</Link>
                </div>
            </div>
        </nav>
    )
}