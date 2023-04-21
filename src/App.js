import React, { useContext } from 'react';
import { observer } from "mobx-react-lite";
import {BrowserRouter} from "react-router-dom";
import './App.css';
import { NavBar } from './components/NavBar';
import { Context } from '.';
import { AppRouter } from './components/AppRouter';


const App = observer(() => {
  
  const {user} = useContext(Context);

  return (
    <BrowserRouter>
    
    <div className="App">
      <NavBar/>
      <AppRouter/>
    </div>
    
    </BrowserRouter>
  );
})

export default App;
