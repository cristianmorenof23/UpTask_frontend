import React from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import Swal from 'sweetalert2'
import clienteAxios from '../config/clienteAxios'

const OlvidePassword = () => {

    const [email, setEmail] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (email === '' || email.length < 6) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'El Email es Obligatorio!',
            })
            return
        }

        try {
            const {data} = await clienteAxios.post(`/usuarios/olvide-password`, {email})

            Swal.fire({
                icon: 'success',
                text: data.msg,
                confirmButtonText: 'De acuerdo!'
            })
        } catch (error) {
            Swal.fire({
                icon: 'error',
                text: error.response.data.msg,
                confirmButtonText: 'Intentar de Nuevo'
            })
        }
    }

    return (
        <>
            <h1 className='text-sky-600 font-black text-6xl capitalize text-focus-in'>Recupera tu acceso y no pierdas tus  {' '} <span className='text-slate-700'>proyectos</span> </h1>

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

                <input
                    type='submit'
                    value='Enviar Instrucciones'
                    className='bg-sky-700 mb-5 w-full py-3 uppercase text-white font-bold rounded  hover:cursor-pointer hover:bg-sky-800 transition-colors'

                />
            </form>

            <nav className='lg:flex lg:justify-between'>
                <Link
                    to='/'
                    className="block text-center my-5 text-slate-500 uppercase text-sm"
                >¿Ya tienes una cuenta? Inicia Sesion</Link>
                <Link
                    to='registrar'
                    className="block text-center my-5 text-slate-500 uppercase text-sm"
                >¿No tienes una cuenta? Registrate</Link>
            </nav>
        </>
    )
}

export default OlvidePassword