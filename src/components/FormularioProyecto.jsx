import React from 'react'
import { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import useProyectos from '../hooks/useProyectos'
import { useParams } from 'react-router-dom'

const FormularioProyecto = () => {

    const {submitProyecto, proyecto} = useProyectos()

    const [nombre, setNombre] = useState('')
    const [id, setId] = useState(null)
    const [descripcion, setDescripcion] = useState('')
    const [fechaEntrega, setFechaEntrega] = useState('')
    const [cliente, setCliente] = useState('')

    const params = useParams()

    useEffect(() => {
        if(params.id ){
            setNombre(proyecto.nombre)
            setId(proyecto._id)
            setDescripcion(proyecto.descripcion)
            setFechaEntrega(proyecto.fechaEntrega?.split('T')[0])
            setCliente(proyecto.cliente)
        }
    }, [params])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if([nombre, descripcion, fechaEntrega, cliente].includes('')){
            Swal.fire({
                icon: 'error',
                title: 'Hubo un error!',
                text: 'Todos los campos son obligatorios',
                confirmButtonText: 'Intentar de Nuevo',
                timer: 3000
            })

            return
        }
        // Pasar los datos hacia al provider
        await submitProyecto({id, nombre, descripcion, fechaEntrega, cliente})

        setId(null)
        setNombre('')
        setDescripcion('')
        setFechaEntrega('')
        setCliente('')
    }

    return (
        <form className='bg-white py-10 px-5 md:w-1/2 rounded-lg shadow' onSubmit={handleSubmit}>
            <div className='mb-5'>
                <label className='text-gray-700 uppercase font-bold text-sm' htmlFor='nombre'>Nombre Proyecto</label>
                <input type='text' className='border w-full p-2 mt-2 placeholder-gray-400 rounded-md' id='nombre' placeholder='Nombre del Proyecto'
                    value={nombre}
                    onChange={e => setNombre(e.target.value)}
                ></input>
            </div>

            <div className='mb-5'>
                <label className='text-gray-700 uppercase font-bold text-sm' htmlFor='nombre'>Descripcion</label>
                <textarea className='border w-full p-2 mt-2 placeholder-gray-400 rounded-md resize-none' id='descripcion' placeholder='Descripcion del Proyecto'
                    value={descripcion}
                    onChange={e => setDescripcion(e.target.value)}
                ></textarea>
            </div>

            <div className='mb-5'>
                <label className='text-gray-700 uppercase font-bold text-sm' htmlFor='fecha-entrega'>Fecha Entrega</label>
                <input type='date' className='border w-full p-2 mt-2 placeholder-gray-400 rounded-md' id='fecha-entrega' placeholder='Fecha entrega del Proyecto'
                    value={fechaEntrega}
                    onChange={e => setFechaEntrega(e.target.value)}
                ></input>
            </div>

            <div className='mb-5'>
                <label className='text-gray-700 uppercase font-bold text-sm' htmlFor='cliente'>Nombre Cliente</label>
                <input type='text' className='border w-full p-2 mt-2 placeholder-gray-400 rounded-md' id='cliente' placeholder='Nombre del Cliente'
                    value={cliente}
                    onChange={e => setCliente(e.target.value)}
                ></input>
            </div>

            <input
                type='submit'
                value={id ? 'Actualizar Proyecto' : 'Crear Proyecto'}
                className='bg-sky-600 w-full p-3 uppercase font-bold text-white rounded cursor-pointer hover:bg-sky-800 transition-colors'
            />
        </form>
    )
}

export default FormularioProyecto