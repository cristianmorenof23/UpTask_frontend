import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AuthLayout from './layouts/AuthLayout'
import Login from './pages/Login'
import Registrar from './pages/Registrar'
import OlvidePassword from './pages/OlvidePassword'
import NuevoPassword from './pages/NuevoPassword'
import ConfirmarCuenta from './pages/ConfirmarCuenta'
import { AuthProvider } from './context/AuthProvider'
import { ProyectoProvider } from './context/ProyectoProvider'
import EditarProyecto from './pages/EditarProyecto'
import RutaProtegida from './layouts/RutaProtegida'
import Proyectos from './pages/Proyectos'
import NuevoProyecto from './pages/NuevoProyecto'
import Proyecto from './pages/Proyecto'
import NuevoColaborador from './pages/NuevoColaborador'


function App() {

    return (
        <BrowserRouter>
            <AuthProvider>
                <ProyectoProvider>
                    <Routes>
                        <Route path="/" element={<AuthLayout />}>
                            <Route index element={<Login />} />
                            <Route path="registrar" element={<Registrar />} />
                            <Route path="olvide-password" element={<OlvidePassword />} />
                            <Route path="olvide-password/:token" element={<NuevoPassword />} />
                            <Route path="confirmar/:id" element={<ConfirmarCuenta />} />
                        </Route>

                        <Route path='/proyectos' element={<RutaProtegida />}>
                            <Route index element={<Proyectos />}></Route>
                            <Route path='crear-proyecto' element={<NuevoProyecto />}></Route>
                            <Route path='nuevo-colaborador/:id' element={<NuevoColaborador />}></Route>
                            <Route path=':id' element={<Proyecto />}></Route>
                            <Route path='editar/:id' element={<EditarProyecto />}></Route>
                        </Route>
                    </Routes>
                </ProyectoProvider>
            </AuthProvider>
        </BrowserRouter>
    )
}

export default App