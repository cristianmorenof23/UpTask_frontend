import FormularioColaborador from "../components/FormularioColaborador"
import { useEffect } from "react"
import useProyectos from "../hooks/useProyectos"
import { useParams } from "react-router-dom"
import Spinner from "../components/Spinner"

const NuevoColaborador = () => {

    const {obtenerProyecto, proyecto, cargando, colaborador, agregarColaborador} = useProyectos()
    const params = useParams()

    useEffect(() => {
        obtenerProyecto(params.id)
    }, [])


    if(cargando) return <Spinner/>

    
    return (
        <>
            <h1 className="text-4xl font-black tracking-in-expand">Añadir Colaborador al Proyecto: {proyecto.nombre}</h1>

            <div className="mt-10 flex justify-center">
                <FormularioColaborador/>
            </div>

            {cargando ? <Spinner/> : colaborador?._id && (
                <div className="flex justify-center mt-10">
                    <div className="bg-white py-10 px-5 md:w-1/2 rounded-lg shadow w-full">
                        <h2 className="text-center mb-10 text-2xl font-bold">Resultado:</h2>

                        <div className="flex justify-between items-center">
                            <p>{colaborador.nombre}</p>

                            <button
                                type="button"
                                className="bg-slate-500 px-6 py-3 rounded-lg uppercase text-white font-bold text-sm hover:bg-slate-700 transition-colors"
                                onClick={() => agregarColaborador({
                                    email: colaborador.email
                                })}
                            >Agregar al Proyecto</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default NuevoColaborador