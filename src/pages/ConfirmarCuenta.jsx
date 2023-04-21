import React from 'react'
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import clienteAxios from '../config/clienteAxios'
import Swal from 'sweetalert2'


const ConfirmarCuenta = () => {

    const params = useParams()
    const [cuentaConfirmada, setCuentaConfirmada] = useState(false)
    const { id } = params

    useEffect(() => {
        const confirmarCuenta = async () => {
            try {
                const url = `/usuarios/confirmar/${id}`
                const { data } = await clienteAxios(url)

                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Usuario confirmado correctamente',
                    showConfirmButton: false,
                    timer: 2000
                })
                setCuentaConfirmada(true)

                console.log(data);
            } catch (error) {
                console.log(error);
            }
        }
        confirmarCuenta()
    }, [])


    return (
        <>
            <h1 className='text-sky-600 font-black text-6xl capitalize text-focus-in'>Confirma tu cuenta y comienza a crear tus  {' '} <span className='text-slate-700'>proyectos</span> </h1>
            <div className='mt-20 md:mt-5 shadow-lg px-5 py-10 rounded-xl bg-white'>
                {cuentaConfirmada && (
                    <Link
                        to='/'
                        className="block text-center my-5 text-slate-500 uppercase text-sm font-bold"
                    >Inicia Sesion</Link>
                )}
            </div>
        </>
    )
}

export default ConfirmarCuenta