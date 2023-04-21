import useProyectos from "../hooks/useProyectos"
import { useNavigate } from "react-router-dom"

const Colaborador = ({ colaborador }) => {

    const {handleModalEliminarColaborador} = useProyectos()
    const { nombre, email } = colaborador
    const navigate = useNavigate()


    return (
        <div className='border-b p-5 flex justify-between items-center'>
            <div>
                <p>{nombre}</p>
                <p className='text-sm text-gray-700'>{email}</p>
            </div>

            <div>
                <button
                type="button"
                className="bg-red-600 py-3 px-5 uppercase font-bold text-white rounded-lg hover:bg-red-800 transition-colors"
                onClick={() => handleModalEliminarColaborador(colaborador)}
                >Eliminar</button>
            </div>
        </div>
    )
}

export default Colaborador