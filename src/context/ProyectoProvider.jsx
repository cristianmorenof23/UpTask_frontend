import { useState, useEffect, createContext } from "react"
import clienteAxios from "../config/clienteAxios"
import { useNavigate } from 'react-router-dom'
import Swal from "sweetalert2"
import useAuth from "../hooks/useAuth"
import io from 'socket.io-client'
let socket


const ProyectoContext = createContext()

const ProyectoProvider = ({ children }) => {

    const [proyectos, setProyectos] = useState([])
    const [proyecto, setProyecto] = useState({})
    const [cargando, setCargando] = useState(false)
    const [modalFormularioTarea, setModalFormularioTarea] = useState(false)
    const [modalEliminarTarea, setModalEliminarTarea] = useState(false)
    const [tarea, setTarea] = useState({})
    const [colaborador, setColaborador] = useState({})
    const [modalEliminarColaborador, setModalEliminarColaborador] = useState(false)
    const [buscador, setBuscador] = useState(false)

    const {auth} = useAuth()


    // Reedireccionar una vez creado un proyecto
    const navigate = useNavigate()

    useEffect(() => {
        const obtenerProyectos = async () => {
            try {
                const token = localStorage.getItem('token')
                if (!token) return

                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }

                const { data } = await clienteAxios('/proyectos', config)
                setProyectos(data)
            } catch (error) {
                console.log(error);
            }
        }
        obtenerProyectos()
    }, [auth])

    useEffect(() => {
        socket = io(import.meta.env.VITE_BACKEND_URL)
    }, [])


    const submitProyecto = async (proyecto) => {

        if (proyecto.id) {
            await editarProyecto(proyecto)
        } else {
            await nuevoProyecto(proyecto)
        }



    }

    const editarProyecto = async (proyecto) => {
        try {
            const token = localStorage.getItem('token')
            if (!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.put(`/proyectos/${proyecto.id}`, proyecto, config)

            // Sincronizar el state
            const proyectosActualizados = proyectos.map((proyectoState) => proyectoState._id === data._id ? data : proyectoState)
            setProyectos(proyectosActualizados)


            Swal.fire({
                icon: 'success',
                title: 'Proyecto Actualizado Correctamente',
                showConfirmButton: null,
                timer: 2400
            })

            setTimeout(() => {
                navigate('/proyectos')
            }, 2500)
        } catch (error) {
            console.log(error);
        }
    }

    const nuevoProyecto = async (proyecto) => {
        try {
            const token = localStorage.getItem('token')
            if (!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.post('/proyectos', proyecto, config)

            setProyectos([...proyectos, data])

            Swal.fire({
                icon: 'success',
                title: 'Proyecto Creado Correctamente',
                confirmButtonText: 'Confirmar'
            })

            setTimeout(() => {
                navigate('/proyectos')
            }, 2500)
        } catch (error) {
            console.log(error);
        }
    }

    const obtenerProyecto = async (id) => {
        setCargando(true)
        try {
            const token = localStorage.getItem('token')
            if (!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios(`/proyectos/${id}`, config)
            setProyecto(data)


        } catch (error) {
            navigate('/proyectos')
            Swal.fire({
                icon: 'error',
                title: error.response.data.msg
            })
        } finally {
            setCargando(false)
        }
    }

    const eliminarProyecto = async (id) => {
        try {
            const token = localStorage.getItem('token')
            if (!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.delete(`/proyectos/${id}`, config)

            // Sincroinzar el state
            const proyectosActualizados = proyectos.filter(proyectoState => proyectoState._id !== id)
            setProyectos(proyectosActualizados)

            setTimeout(() => {
                navigate('/proyectos')
            }, 2000)
        } catch (error) {
            console.log(error);
        }
    }

    const handleModalTarea = () => {
        setModalFormularioTarea(!modalFormularioTarea)
        setTarea({})
    }

    const submitTarea = async (tarea) => {

        if (tarea?.id) {
            await editarTarea(tarea)
        } else {
            await crearTarea(tarea)
        }

    }

    const crearTarea = async tarea => {
        try {
            const token = localStorage.getItem('token')
            if (!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.post('/tareas', tarea, config)

            setModalFormularioTarea(false)
            // Socket io
            socket.emit('nueva tarea', data)

        } catch (error) {
            console.log(error);
        }
    }

    const editarTarea = async (tarea) => {
        try {
            const token = localStorage.getItem('token')
            if (!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.put(`/tareas/${tarea.id}`, tarea, config)

            //Socket
            socket.emit('actualizar tarea', data)

            setModalFormularioTarea(false)
        } catch (error) {
            console.log(error);
        }
    }

    const handleModalEditarTarea = (tarea) => {
        setTarea(tarea)
        setModalFormularioTarea(true)
    }

    const handleModalEliminarTarea = (tarea) => {
        setTarea(tarea)
        setModalEliminarTarea(!modalEliminarTarea)
    }

    const eliminarTarea = async () => {
        try {
            const token = localStorage.getItem('token')
            if (!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.delete(`/tareas/${tarea._id}`, config)
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: data.msg,
                showConfirmButton: false,
                timer: 1500
            })
            setModalEliminarTarea(false)

            //Socket 
            socket.emit('eliminar tarea', tarea)
            setTarea({})
        } catch (error) {
            console.log(error);
        }
    }

    const submitColaborador = async (email) => {
        setCargando(true)
        try {
            const token = localStorage.getItem('token')
            if (!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.post('/proyectos/colaboradores', { email }, config)
            setColaborador(data)

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: error.response.data.msg,
                confirmButtonText: 'Intenta con otro Email'
            })
        } finally {
            setCargando(false)
        }
    }

    const agregarColaborador = async (email) => {
        try {
            const token = localStorage.getItem('token')
            if (!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.post(`/proyectos/colaboradores/${proyecto._id}`, email, config)

            Swal.fire({
                icon: 'success',
                position: 'top-end',
                title: data.msg,
                showConfirmButton: false,
                timer: 1500
            })
            setColaborador({})
            navigate('/proyectos')


        } catch (error) {
            Swal.fire({
                icon: 'info',
                title: error.response.data.msg,
                confirmButtonText: 'Intentar de Nuevo'
            })
        }
    }

    const handleModalEliminarColaborador = (colaborador) => {
        setModalEliminarColaborador(!modalEliminarColaborador)
        setColaborador(colaborador)
    }

    const eliminarColaborador = async () => {
        try {
            const token = localStorage.getItem('token')
            if (!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.post(`/proyectos/eliminar-colaborador/${proyecto._id}`, { id: colaborador._id }, config)

            const proyectoActualizado = { ...proyecto }

            proyectoActualizado.colaboradores = proyectoActualizado.colaboradores.filter(colaboradorState => colaboradorState._id !== colaborador._id)

            setProyecto(proyectoActualizado)

            Swal.fire({
                icon: 'success',
                position: 'top-end',
                title: data.msg,
                showConfirmButton: false,
                timer: 1500
            })
            setColaborador({})
            setModalEliminarColaborador(false)

        } catch (error) {
            console.log(error.response);
        }
    }

    const completarTarea = async (id) => {
        try {
            const token = localStorage.getItem('token')
            if (!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.post(`/tareas/estado/${id}`, {}, config)

            // Socket
            socket.emit('cambiar estado', data)
            setTarea({})

        } catch (error) {
            console.log(error.response);
        }
    }

    const handleBuscador = () => {
        setBuscador(!buscador)
    }

    // socket io
    const submitTareasProyecto = (tarea) => {
        const proyectoActualizado = { ...proyecto }
        proyectoActualizado.tareas = [...proyectoActualizado.tareas, tarea]
        setProyecto(proyectoActualizado)
    }

    const eliminarTareaProyecto = tarea => {
        const proyectoActualizado = { ...proyecto }
        proyectoActualizado.tareas = proyectoActualizado.tareas.filter(tareaState => tareaState._id !== tarea._id)
        setProyecto(proyectoActualizado)
    }

    const actualizarTareaProyecto = tarea => {
        const proyectoActualizado = { ...proyecto }
        proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState => tareaState._id === tarea._id ? tarea : tareaState)
        setProyecto(proyectoActualizado)
    }

    const cambiarEstadoTarea = tarea => {

        const proyectoActualizado = { ...proyecto }
        proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState => tareaState._id === tarea._id ? tarea : tareaState)
        setProyecto(proyectoActualizado)
    }


    const cerrarSesionProyectos = () => {
        setProyectos([])
        setProyecto({})
    }


    return (
        <ProyectoContext.Provider
            value={{
                proyectos,
                submitProyecto,
                obtenerProyecto,
                proyecto,
                cargando,
                eliminarProyecto,
                modalFormularioTarea,
                handleModalTarea,
                submitTarea,
                handleModalEditarTarea,
                tarea,
                modalEliminarTarea,
                handleModalEliminarTarea,
                eliminarTarea,
                submitColaborador,
                colaborador,
                agregarColaborador,
                handleModalEliminarColaborador,
                modalEliminarColaborador,
                eliminarColaborador,
                completarTarea,
                buscador,
                handleBuscador,
                submitTareasProyecto,
                eliminarTareaProyecto,
                actualizarTareaProyecto,
                cambiarEstadoTarea,
                cerrarSesionProyectos
            }}
        > {children}

        </ProyectoContext.Provider>

    )
}

export {
    ProyectoProvider
}

export default ProyectoContext