import { useState } from "react"
import Swal from "sweetalert2"
import useProyectos from "../hooks/useProyectos"

const FormularioColaborador = () => {
    const [ email, setEmail ] = useState('')

    const {submitColaborador} = useProyectos()

    const handleSubmit = (e) => {
        e.preventDefault()

        if(email === ''){
            Swal.fire({
                icon: 'error',
                title: 'El email es obligatorio',
                confirmButtonText: 'Intentar de Nuevo'
            })
            return
        }

        submitColaborador(email)
    }

    return (
        <form className='bg-white py-10 px-5 w-full md:w-1/2 rounded-lg shadow' onSubmit={handleSubmit}>
            <div className='mb-5'>
                <label className='text-gray-700 uppercase font-bold text-sm' htmlFor='email'>Email Colaborador</label>
                <input
                    id='email'
                    type='email'
                    placeholder='Email del usuario'
                    className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md'
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
            </div>
            <input type='submit' className='bg-sky-600 hover:bg-sky-800 w-full p-3 text-white uppercase font-bold cursor-pointer transition-colors rounded' value='Buscar Colaborador' />
        </form>
    )
}

export default FormularioColaborador