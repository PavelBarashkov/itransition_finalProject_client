import React, {useState} from 'react';
import './App.css';
import { LoginGoogle }  from './components/LoginGoogle';
import { LogoutGoogle } from './components/LogoutGoogle';
import { useEffect } from 'react';
import { gapi } from 'gapi-script'

import FacebookLogin from 'react-facebook-login';
import axios from 'axios';

const clientId = '115284206815-itf8mprr1ioqj9pltsd2fqoiv5r7dqjs.apps.googleusercontent.com';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [name, setName] = useState('');
  const [id, setId] = useState('');

  const responseFacebook = (response) => {
    console.log(response)
    axios.post('http://localhost:5000/api/authSocial/facebook', { accessToken: response.accessToken })
      .then(res => {
        const { token } = res.data;
        localStorage.setItem('token', token);
        setLoggedIn(true);
        setName(res.data.name);
        setId(res.data.email);
      })
      .catch(err => console.log(err));
  }

  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: clientId,
        scope: ""
      })
    };
    gapi.load('client:auth2', start);
  })
  return (
    <div className="App">
      <LoginGoogle/>
      <LogoutGoogle />
      <FacebookLogin
          appId='1992083367821148'
          autoLoad={false}
          fields="name,email"
          callback={responseFacebook}
           />
      
    </div>
  );
}

export default App;
