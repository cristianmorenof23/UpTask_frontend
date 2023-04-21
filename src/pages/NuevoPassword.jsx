import React from 'react'
import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import clienteAxios from '../config/clienteAxios'
import Swal from 'sweetalert2'

const NuevoPassword = () => {

    const [tokenValido, setTokenValido] = useState(false)
    const [password, setPassword] = useState('')
    const [passwordModificado, setPasswordModificado] = useState(false)

    const params = useParams()
    const { token } = params

    useEffect(() => {
        const comprobarToken = async () => {
            try {
                await clienteAxios(`/usuarios/olvide-password/${token}`)
                setTokenValido(true)
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    text: error.response.data.msg,
                    confirmButtonText: 'Intentar de Nuevo'
                })
            }
        }
        comprobarToken()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (password.length < 6) {
            Swal.fire({
                icon: 'error',
                title: 'Hubo un Error!',
                text: 'El password debe ser minimo de 6 caracteres',
                confirmButtonText: 'Intentar de Nuevo'
            })
            return
        }

        try {
            const url = `/usuarios/olvide-password/${token}`

            const { data } = await clienteAxios.post(url, { password })
            Swal.fire({
                icon: 'success',
                text: data.msg,
                confirmButtonText: 'Confirmar'
            })
            setPasswordModificado(true)
        } catch (error) {
            Swal.fire({
                icon: 'info',
                text: error.response.data.msg
            })
        }
    }


    return (<>
        <h1 className='text-sky-600 font-black text-6xl capitalize text-focus-in'>Reestablece tu Password y no pierdas acceso a tus  {' '} <span className='text-slate-700'>proyectos</span> </h1>

        {tokenValido && (
            <form className='my-10 bg-white shadow rounded-lg p-10' onSubmit={handleSubmit}>

                <div className='my-5'>
                    <label
                        className='uppercase text-gray-600 block text-xl font-bold'
                        htmlFor='password'

                    >Nuevo Password</label>
                    <input
                        type='password'
                        placeholder='Escribe tu nuevo Password'
                        className='w-full mt-3 p-3 border rounded-xl bg-gray-100'
                        id='password'
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>


                <input
                    type='submit'
                    value='Guardar Nuevo Password'
                    className='bg-sky-700 mb-5 w-full py-3 uppercase text-white font-bold rounded  hover:cursor-pointer hover:bg-sky-800 transition-colors'
                />
            </form>
        )}
        {passwordModificado && (
            <Link
                to='/'
                className="block text-center my-5 text-slate-500 uppercase text-sm font-bold"
            >Inicia Sesion</Link>
        )}
    </>
    )
}

export default NuevoPassword