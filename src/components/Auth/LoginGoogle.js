import  {GoogleLogin}  from 'react-google-login';
import {AiOutlineGoogle} from "react-icons/ai"
import axios from 'axios';
import { useContext } from 'react';
import { Context } from '../..';
const clientId = '115284206815-itf8mprr1ioqj9pltsd2fqoiv5r7dqjs.apps.googleusercontent.com';

export function LoginGoogle() {
    const {user} = useContext(Context)
    const onSuccess = async (res) => {
        const token = res.tokenId;

        try{
            const res = await axios.post('http://localhost:5000/api/authSocial/google', {token});
            const { data } = res;
            localStorage.setItem('token', data.token); 
            await user.setUser(user);
            await user.setIsAuth(true); 
        } catch (e) {
            console.log(e);
        }
    }

      const onFailure = (res) => {
        console.log('Ошибка'+ res);
      }
  return (
            <GoogleLogin
                clientId={process.env.REACT_APP_CLIENT_ID_GOOGLE}
                
                onSuccess={onSuccess}
                onFailure={onFailure}
                cookiePolicy={'single_host_origin'}
                isSignedIn={false}
                render={renderProps => (
                    <button 
                      onClick={renderProps.onClick} 
                      style={{border: 'none', backgroundColor: 'transparent'}}
                    >
                      <AiOutlineGoogle size={'2em'} />
                    </button>
                  )}
        />

  );
}

