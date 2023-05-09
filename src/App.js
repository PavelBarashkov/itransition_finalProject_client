import { Suspense } from 'react';
import React, { useContext, useState, useEffect } from 'react';
import { observer } from "mobx-react-lite";
import {BrowserRouter} from "react-router-dom";
import './App.css';
import { NavBar } from './components/Header/NavBar';
import { Context } from '.';
import { AppRouter } from './components/AppRouter';
import { check } from './API/http/userAPI';
import { Spinner } from 'react-bootstrap';
import { useTheme } from './hooks/useTheme';

const App = observer(() => {
    const {theme, setTheme} = useTheme()
    const {user} = useContext(Context);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    
        check().then(data => {
        user.setUser(true)
        user.setIsAuth(true)
        }).finally(() => setLoading(false))
    }, [])

    if(loading) {
        return <Spinner animation={"grow"}/>
    }
    
    return (
        <Suspense fallback={null}>
            <BrowserRouter>
            <div className='app_container w-100 h-100'>
                <NavBar/>
                <AppRouter />
            </div>
            </BrowserRouter>
        </Suspense>
    )
})

export default App;
