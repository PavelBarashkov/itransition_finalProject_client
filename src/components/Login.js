import React, {useState, useEffect, useContext} from 'react';
import { gapi } from 'gapi-script'  
import { Button, Container, InputGroup, Form} from "react-bootstrap"
import { LoginGoogle } from "./LoginGoogle"
import FacebookLogin from 'react-facebook-login';
import axios from 'axios';
import {AiFillFacebook} from "react-icons/ai"
import { Context } from "../index";
import Col from 'react-bootstrap/Col';
import { login, registration } from '../API/http/userAPI';
const clientId = '115284206815-itf8mprr1ioqj9pltsd2fqoiv5r7dqjs.apps.googleusercontent.com';

export const Login = () => {
    const {user} = useContext(Context);    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const [loggedIn, setLoggedIn] = useState(false);
    const [nameGoogle, setNameGoogle] = useState('');
    const [id, setId] = useState('');

    const [isLogin, setIsLogin] = useState(true);

    useEffect(() => {
        function start() {
          gapi.client.init({
            clientId: clientId,
            scope: ""
          })
        };
        gapi.load('client:auth2', start);
      })

      const responseFacebook = (response) => {
        console.log(response)
        axios.post('http://localhost:5000/api/authSocial/facebook', { accessToken: response.accessToken })
          .then(res => {
            const { token } = res.data;
            localStorage.setItem('token', token);
            setLoggedIn(true);
            setNameGoogle(res.data.name);
            setId(res.data.email);
          })
          .catch(err => console.log(err));
      }

    const [validatedLogin, setValidatedLogin] = useState(false);
    const [validatedRegistration, setValidatedRegistration] = useState(false);
    
    const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
    }
    if(isLogin) {
        setValidatedLogin(true);
    } 
    if (!isLogin) {
        setValidatedRegistration(true)
    }
    };

    function swithRegistration() {
        setIsLogin(false);
    }

    const click = async () => {
        try {
            let data;
            if(isLogin) {
                data = await login(email, password);
            } else {
                data = await registration(name, email, password);
            }
            await user.setUser(user);
            await user.setIsAuth(true);
        } catch (e) {
            alert(e.response.data.message);
        }
    }

    return (
        <Container>
            {isLogin
                ?
                    <Container>
                        <Form noValidate validated={validatedLogin} onSubmit={handleSubmit}>
                            <Button type="submit" onClick={click} >Вход</Button>
                            <Form.Group as={Col} md="15" controlId="validationCustomUsername">
                                <Form.Label>Username</Form.Label>
                                <InputGroup hasValidation>
                                    <InputGroup.Text id="inputGroupPrepend" style={{width: '80px'}}>Логин</InputGroup.Text>
                                    <Form.Control
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        type="text"
                                        placeholder="Alex"
                                        aria-describedby="inputGroupPrepend"
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                    </Form.Control.Feedback>
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="15" controlId="validationCustomUsername">
                                <Form.Label>Username</Form.Label>
                                <InputGroup hasValidation>
                                    <InputGroup.Text id="inputGroupPrepend" style={{width: '80px'}}>Пароль</InputGroup.Text>
                                    <Form.Control
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        type="text"
                                        placeholder="123456"
                                        aria-describedby="inputGroupPrepend"
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                    </Form.Control.Feedback>
                                </InputGroup>
                            </Form.Group>
                        </Form>
                        <LoginGoogle />
                        <FacebookLogin
                            appId='1992083367821148'
                            autoLoad={false}
                            fields="name,email"
                            callback={responseFacebook}
                            icon={<AiFillFacebook size={'2em'}/>}
                            textButton=''
                            cssClass="my-facebook-button-class"
                        />
                        <div style={{color: 'black'}}>Или</div>
                        <Button onClick={() => swithRegistration()}>Создать акаунт</Button>
                    </Container>
                :
                <Container>
                    <Button onClick={() => setIsLogin(true)}>Назад</Button>
                    <Form noValidate validated={validatedRegistration} onSubmit={handleSubmit}>
                        <Button type="submit" onClick={click}>Вход</Button>
                        <Form.Group as={Col} md="15" controlId="validationCustomUsername">
                            <Form.Label>Username</Form.Label>
                                <InputGroup hasValidation>
                                    <InputGroup.Text id="inputGroupPrepend" style={{width: '80px'}}>Имя</InputGroup.Text>
                                    <Form.Control
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        type="text"
                                        placeholder="Alex"
                                        aria-describedby="inputGroupPrepend"
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                    </Form.Control.Feedback>
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="15" controlId="validationCustomUsername">
                                <Form.Label>Username</Form.Label>
                                <InputGroup hasValidation>
                                    <InputGroup.Text id="inputGroupPrepend" style={{width: '80px'}}>Email</InputGroup.Text>
                                    <Form.Control
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        type="text"
                                        placeholder="Alex@gmail.com"
                                        aria-describedby="inputGroupPrepend"
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                    </Form.Control.Feedback>
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="15" controlId="validationCustomUsername">
                                <Form.Label>Username</Form.Label>
                                <InputGroup hasValidation>
                                    <InputGroup.Text id="inputGroupPrepend" style={{width: '80px'}}>Пароль</InputGroup.Text>
                                    <Form.Control
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        type="text"
                                        placeholder="123456"
                                        aria-describedby="inputGroupPrepend"
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                    </Form.Control.Feedback>
                                </InputGroup>
                            </Form.Group>
                    </Form>
                </Container>
            }
            
        </Container>
        )

}