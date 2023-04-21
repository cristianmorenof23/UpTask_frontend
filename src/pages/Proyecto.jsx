import React from 'react'
// Con useParams leemos los parametros de la url
import { useParams, Link } from 'react-router-dom'
import useProyectos from '../hooks/useProyectos'
import { useEffect } from 'react'
import Spinner from '../components/Spinner'
import ModalFormularioTarea from '../components/ModalFormularioTarea'
import ModalEliminarTarea from '../components/ModalEliminarTarea'
import Tarea from '../components/Tarea'
import Colaborador from '../components/Colaborador'
import ModalEliminarColaborador from '../components/modalEliminarColaborador'
import useAdmin from '../hooks/useAdmin'
import io from 'socket.io-client'


let socket;

const Proyecto = () => {

    const params = useParams()
    const { obtenerProyecto, proyecto, cargando, handleModalTarea, submitTareasProyecto, eliminarTareaProyecto, actualizarTareaProyecto, cambiarEstadoTarea } = useProyectos()
    const admin = useAdmin()

    useEffect(() => {
        obtenerProyecto(params.id)
    }, [])

    // UseEffect para socket io
    useEffect(() => {
        socket = io(import.meta.env.VITE_BACKEND_URL)
        socket.emit('abrir proyecto', params.id)
    }, [])

    useEffect(() => {
        socket.on("tarea agregada", tareaNueva => {
            if (tareaNueva.proyecto === proyecto._id) {
                submitTareasProyecto(tareaNueva)
            }
        })

        socket.on('tarea eliminada', tareaEliminada => {
            if(tareaEliminada.proyecto === proyecto._id){
                eliminarTareaProyecto(tareaEliminada)
            }
        })

        socket.on('tarea actualizada', tareaActualizada => {
            if(tareaActualizada.proyecto._id === proyecto._id){
                actualizarTareaProyecto(tareaActualizada)
            }
        })

        socket.on('nuevo estado', nuevoEstadoTarea => {
            if(nuevoEstadoTarea.proyecto._id === proyecto._id){
                cambiarEstadoTarea(nuevoEstadoTarea)
            }
        })
    })

    const { nombre } = proyecto

    return (
        cargando ? <Spinner /> : (
            <>

                <div className='flex justify-between'>
                    <h1 className='font-black text-4xl tracking-in-expand'>{nombre}</h1>

                    {admin && (
                        <div className='flex items-center gap-2 text-gray-400 hover:text-black transition-colors'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                            </svg>
                            <Link to={`/proyectos/editar/${params.id}`} className='uppercase font-bold'>
                                Editar
                            </Link>
                        </div>
                    )}

                </div>

                {admin && (
                    <button onClick={handleModalTarea} type='button' className='text-sm px-5 py-3 w-full md:w-auto rounded-lg uppercase font-bold bg-sky-400 text-white text-center mt-5 flex gap-2 items-center justify-center'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                        Nueva Tarea</button>
                )}


                <p className='font-bold text-xl mt-10'>Tareas del Proyecto</p>

                <div className='bg-white shadow mt-10 rounded-lg'>
                    {proyecto.tareas?.length ? proyecto.tareas?.map((tarea) => (
                        <Tarea key={tarea._id} tarea={tarea} />
                    )) : <p className='text-center my-5 p-10'>No hay tareas en este proyecto</p>}
                </div>

                {admin && (

                    <>
                        <div className='flex items-center justify-between mt-10'>
                            <p className='font-bold text-xl'>Colaboradores</p>
                            <Link to={`/proyectos/nuevo-colaborador/${proyecto._id}`} className='text-gray-600 hover:text-black transition-colors font-bold uppercase'>Añadir</Link>
                        </div>

                        <div className='bg-white shadow mt-10 rounded-lg'>
                            {proyecto.colaboradores?.length ? proyecto.colaboradores?.map((colaborador) => (
                                <Colaborador key={colaborador._id} colaborador={colaborador} />
                            )) : <p className='text-center my-5 p-10'>No hay colaboradores en este proyecto</p>}
                        </div>
                    </>

                )}



                <ModalFormularioTarea />
                <ModalEliminarTarea />
                <ModalEliminarColaborador />
            </>
        )


    )
}

export default Proyecto