import React, { FunctionComponent, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Drawer from './components/Drawer';
import Billing from './components/Billing';
import Home from './components/Home';
import Inventory from './components/Inventory';
import Reports from './components/Reports';
import Login from './components/Login';
import Register from './components/Register';
import PrivateRoute from './components/PrivateRoute';
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Profile from './components/Profile';

const App: FunctionComponent = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const { userInfo } = useSelector((state: any) => state.auth);

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    return (
        <div>
            {/* <Header onMenuClick={toggleDrawer} /> */}
            {userInfo && <Header onMenuClick={toggleDrawer} />}
            <ToastContainer />
            <Drawer open={drawerOpen} onClose={toggleDrawer} />

            <Routes>

                {/* <Route path='/' index element={<Login />} /> */}
                <Route path='/' element={<Navigate to="/login" replace />} />

                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route path='/' element={<PrivateRoute />}>
                    {/* <Route index element={<Login />} /> */}

                    {/* <Route index element={<Navigate to="/login" replace />} /> */}

                    <Route path="/billing" element={<Billing />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/" element={<Home />} />
                    <Route path="/inventory" element={<Inventory />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/profile" element={<Profile />} />
                </Route>
                
                 {/* Ruta para capturar todas las rutas no coincidentes */}
                 <Route path="*" element={<Navigate to="/home" replace />} />
                {/* También puedes mostrar un mensaje personalizado */}
                {/* <Route path="*" element={<div>La página que buscas no existe.</div>} /> */}   
            </Routes>
        </div>
    );
};

export default App;
