import {Alert as CustomAlert} from 'react-bootstrap';

export const Alert = ({data, status}) => {
    let variant;
   
    if (status === 404) {
      variant = 'danger';
    } else {
        variant = 'success';
    }
    
    return (
      <CustomAlert variant={variant} className='alert'>
        {data}
      </CustomAlert>
    );
  }