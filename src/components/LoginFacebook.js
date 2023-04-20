import FacebookLogin from 'react-facebook-login';

export const FacebookLoginButton = ({ onFacebookLogin }) => {
    const responseFacebook = (response) => {
      onFacebookLogin(response.accessToken);
    };
  
    return (
      <FacebookLogin
        appId="1992083367821148"
        fields="id, name"
        callback={responseFacebook}
      />
    );
  };
