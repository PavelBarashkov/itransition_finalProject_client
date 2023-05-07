import React, {useState, useEffect, useContext} from 'react';
import { gapi } from 'gapi-script'  
import { Button, Container, InputGroup, Form} from "react-bootstrap"
import { LoginGoogle } from "./LoginGoogle"
import { Context } from "../../index";
import Col from 'react-bootstrap/Col';
import { login, registration } from '../../API/http/userAPI';
import {FacebookAuth} from "./LoginFacebook"

export const Login = () => {
    const {user} = useContext(Context);    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const [isLogin, setIsLogin] = useState(true);

    useEffect(() => {
        function start() {
          gapi.client.init({
            clientId: process.env.REACT_APP_CLIENT_ID_GOOGLE,
            scope: ""
          })
        };
        gapi.load('client:auth2', start);
      })

    const [validatedLogin, setValidatedLogin] = useState(false);
    const [validatedRegistration, setValidatedRegistration] = useState(false);
    
    const handleSubmit = (event) => {
        event.preventDefault();
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
                        <Form noValidate validated={validatedLogin} onSubmit={handleSubmit} className='form_Auth'>
                            <Form.Group as={Col} md="15">
                                <InputGroup hasValidation>
                                    <InputGroup.Text style={{width: '80px'}}>Логин</InputGroup.Text>
                                    <Form.Control
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        type="text"
                                        placeholder="Alex"
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                    </Form.Control.Feedback>
                                </InputGroup>
                            </Form.Group>
                            
                            <Form.Group as={Col} md="15" >
                                <InputGroup hasValidation>
                                    <InputGroup.Text style={{width: '80px'}}>Пароль</InputGroup.Text>
                                    <Form.Control
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        type="text"
                                        placeholder="123456"
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                    </Form.Control.Feedback>
                                </InputGroup>
                            </Form.Group>
                            <Button 
                                variant="success"
                                type="submit" 
                                onClick={click} 
                            >
                                Вход
                            </Button>

                        </Form>
                        <div className='auth_social'>
                            <LoginGoogle />
                            <FacebookAuth  />
                        </div>
                        
                        <div style={{display: 'flex', justifyContent: 'center'}}>Или</div>
                        <Button 
                            className='btn_auth btn_auth--reg'
                            variant="success"
                            onClick={() => swithRegistration()}
                        >
                            Создать акаунт
                        </Button>
                    </Container>
                :
                <Container>
                    <Form noValidate validated={validatedRegistration} onSubmit={handleSubmit} className='form_Auth'>
                        <Form.Group as={Col} md="15" >
                                <InputGroup hasValidation>
                                    <InputGroup.Text  style={{width: '80px'}}>Имя</InputGroup.Text>
                                    <Form.Control
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        type="text"
                                        placeholder="Alex"
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                    </Form.Control.Feedback>
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="15" >
                                <InputGroup hasValidation>
                                    <InputGroup.Text style={{width: '80px'}}>Email</InputGroup.Text>
                                    <Form.Control
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        type="text"
                                        placeholder="Alex@gmail.com"
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                    </Form.Control.Feedback>
                                </InputGroup>
                            </Form.Group>
                            <Form.Group as={Col} md="15">
                                <InputGroup hasValidation>
                                    <InputGroup.Text  style={{width: '80px'}}>Пароль</InputGroup.Text>
                                    <Form.Control
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        type="text"
                                        placeholder="123456"
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                    </Form.Control.Feedback>
                                </InputGroup>
                            </Form.Group>
                        <Button 
                            variant="success"
                            type="submit" 
                            onClick={click}
                        >
                            Зарегистрироваться
                        </Button>
                        <Button 
                            variant="outline-warning"
                            onClick={() => setIsLogin(true)}
                        >
                            Назад
                        </Button>

                    </Form>
                </Container>
            }
            
        </Container>
        )

}