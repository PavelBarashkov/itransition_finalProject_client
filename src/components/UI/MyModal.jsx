import React from "react";
import cl from "./MyModal.module.css";
import { Button, Container } from "react-bootstrap";
import CloseButton from 'react-bootstrap/CloseButton';

export const MyModal = ({children, visible,setVisible}) => {
    const rootClasses = [cl.myModal];
    if(visible) {
        rootClasses.push(cl.active);
    }

    return (
        <Container>
        <div className={rootClasses.join(" ")} onClick={() => setVisible(false)}>
            <div className={cl.myModalContent} onClick={(e) => e.stopPropagation()}>
            <div className="d-flex justify-content-end">
                    <Button 
                        className="d-flex align-items-center  justify-content-center"
                        style={{padding: 7, width: 25, height: 25, marginBottom: 25}}
                        variant="danger"
                        onClick={() => setVisible(false)}
                    > 
                        <CloseButton/>
                    </Button>
                </div>
                {children}
            </div>
        </div>
        </Container>
    )
}



export const BasicExample = ()  => {
  return <CloseButton />;
}

