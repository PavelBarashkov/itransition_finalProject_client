import  {GoogleLogin}  from 'react-google-login';
import axios from 'axios';

const clientId = '115284206815-itf8mprr1ioqj9pltsd2fqoiv5r7dqjs.apps.googleusercontent.com';

export function LoginGoogle() {
    const onSuccess = async (res) => {
        const token = res.tokenId;

        try{
            const res = await axios.post('http://localhost:5000/api/authSocial/google', {token});
            const { data } = res;
            localStorage.setItem('token', data.token);  
        } catch (e) {
            console.log(e);
        }
    }

      const onFailure = (res) => {
        console.log('Ошибка'+ res);
      }
  return (
            <GoogleLogin
                clientId={clientId}
                buttonText="Войти через Google"
                onSuccess={onSuccess}
                onFailure={onFailure}
                cookiePolicy={'single_host_origin'}
                isSignedIn={true}
        />

  );
}

