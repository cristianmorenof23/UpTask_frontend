import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import Swal from "sweetalert2"
import clienteAxios from "../config/clienteAxios"
import useAuth from "../hooks/useAuth"

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const { auth, setAuth, cargando } = useAuth()

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()

        if ([email, password].includes('')) {
            Swal.fire({
                icon: 'error',
                title: 'Hubo un error!',
                text: 'Todos los campos son obligatorios',
                confirmButtonText: 'Intentar de Nuevo',
                confirmButtonColor: 'red'
            })
            return
        }

        try {
            const { data } = await clienteAxios.post('/usuarios/login', { email, password })
            localStorage.setItem('token', data.token)
            setAuth(data)
            navigate('/proyectos')
        } catch (error) {
            Swal.fire({
                icon: 'info',
                title: 'Hubo un error',
                text: error.response.data.msg,
                confirmButtonText: 'Intentar de Nuevo'
            })
        }
    }


    return (
        <>
            <h1 className='text-sky-600 font-black text-6xl capitalize text-focus-in'>Inicia sesion y administra tus {' '} <span className='text-slate-700'>proyectos</span> </h1>

            <form className='my-10 bg-white shadow rounded-lg p-10' onSubmit={handleSubmit}>
                <div className='my-5'>
                    <label
                        className='uppercase text-gray-600 block text-xl font-bold'
                        htmlFor='email'

                    >Email</label>
                    <input
                        type='email'
                        placeholder='Email de Registro'
                        className='w-full mt-3 p-3 border rounded-xl bg-gray-100'
                        id='email'
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>
                <div className='my-5'>
                    <label
                        className='uppercase text-gray-600 block text-xl font-bold'
                        htmlFor='password'

                    >Password</label>
                    <input
                        type='password'
                        placeholder='Password de Registro'
                        className='w-full mt-3 p-3 border rounded-xl bg-gray-100'
                        id='password'
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>

                <input
                    type='submit'
                    value='Iniciar Sesión'
                    className='bg-sky-700 mb-5 w-full py-3 uppercase text-white font-bold rounded  hover:cursor-pointer hover:bg-sky-800 transition-colors'
                />
            </form>

            <nav className='lg:flex lg:justify-between'>
                <Link
                    to='registrar'
                    className="block text-center my-5 text-slate-500 uppercase text-sm"
                >¿No tienes una cuenta? Registrate</Link>

                <Link
                    to='olvide-password'
                    className="block text-center my-5 text-slate-500 uppercase text-sm"
                >Olvide mi password</Link>
            </nav>
        </>
    )
}

export default Login