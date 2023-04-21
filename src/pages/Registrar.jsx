import { Link } from "react-router-dom"
import { useState } from 'react'
import Swal from 'sweetalert2'
import clienteAxios from "../config/clienteAxios"


const Registrar = () => {

    const [nombre, setNombre] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [repetirPassword, setRepetirPassword] = useState('')

    // Validar el formulario
    const handleSubmit = async (e) => {
        e.preventDefault()

        if ([nombre, email, password, repetirPassword].includes('')) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Todos los Campos son Obligatorios'
            })
            return
        }

        if (password !== repetirPassword) {
            Swal.fire('Los password no son iguales')
            return
        }

        if (password.length < 6) {
            Swal.fire('El password es muy corto, agrega minimo 6 caracteres')
            return
        }

        // Crear el usuario en la api
        try {
            const {data} = await clienteAxios.post(`/usuarios`, { nombre, email, password })
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: data.msg,
                showConfirmButton: false,
                timer: 2000
            })

            // Resetear el formulario en caso de que no haya errores
            setNombre('')
            setEmail('')
            setPassword('')
            setRepetirPassword('')

        } catch (error) {
            Swal.fire({
                title: error.response.data.msg,
                showClass: {
                    popup: 'animate__animated animate__fadeInDown'
                },
                hideClass: {
                    popup: 'animate__animated animate__fadeOutUp'
                }
            })
        }

    }


    return (
        <>
            <h1 className='text-sky-600 font-black text-6xl capitalize text-focus-in'>Crea tu cuenta y Administra tus {' '} <span className='text-slate-700'>proyectos</span> </h1>

            <form
                className='my-10 bg-white shadow rounded-lg p-10'
                onSubmit={handleSubmit}
            >
                <div className='my-5'>
                    <label
                        className='uppercase text-gray-600 block text-xl font-bold'
                        htmlFor='nombre'

                    >Nombre</label>
                    <input
                        type='text'
                        placeholder='Ingresa tu nombre'
                        className='w-full mt-3 p-3 border rounded-xl bg-gray-100'
                        id='nombre'
                        value={nombre}
                        onChange={e => setNombre(e.target.value)}
                    />
                </div>
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
                <div className='my-5'>
                    <label
                        className='uppercase text-gray-600 block text-xl font-bold'
                        htmlFor='password2'

                    >Repetir Password</label>
                    <input
                        type='password'
                        placeholder='Repite tu password'
                        className='w-full mt-3 p-3 border rounded-xl bg-gray-100'
                        id='password2'
                        value={repetirPassword}
                        onChange={e => setRepetirPassword(e.target.value)}
                    />
                </div>

                <input
                    type='submit'
                    value='Crear Cuenta'
                    className='bg-sky-700 mb-5 w-full py-3 uppercase text-white font-bold rounded  hover:cursor-pointer hover:bg-sky-800 transition-colors'
                />
            </form>

            <nav className='lg:flex lg:justify-between'>
                <Link
                    to='/'
                    className="block text-center my-5 text-slate-500 uppercase text-sm"
                >¿Ya tienes una cuenta? Inicia Sesion</Link>

                <Link
                    to='olvide-password'
                    className="block text-center my-5 text-slate-500 uppercase text-sm"
                >Olvide mi password</Link>
            </nav>
        </>
    )
}

export default Registrar