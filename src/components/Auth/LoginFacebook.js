import { useContext } from 'react';
import FacebookLogin from 'react-facebook-login';
import { Context } from '../..';
import {AiFillFacebook} from "react-icons/ai"

import axios from 'axios';

export const FacebookAuth = () => {
    const {user} = useContext(Context);
  const responseFacebook = (response) => {
    axios.post('http://localhost:5000/api/authSocial/facebook', { accessToken: response.accessToken })
      .then(async res => {
        const { token } = res.data;
        localStorage.setItem('token', token);
        await user.setUser(user);
        await user.setIsAuth(true);
      })
      .catch(err => console.log(err));
  }

  return (
    <FacebookLogin
        className='icon_faceBook'
      appId={process.env.REACT_APP_CLIENT_ID_FACEBOOK}
      autoLoad={false}
      fields="name,email"
      callback={responseFacebook}
      icon={<AiFillFacebook id='text'  size={'2em'}/>}
      textButton=''
      cssClass="my-facebook-button-class"
    />
  )
}
