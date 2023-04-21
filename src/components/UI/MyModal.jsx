import React from "react";
import cl from "./MyModal.module.css";
import { Button } from "react-bootstrap";

export const MyModal = ({children, visible,setVisible}) => {
    const rootClasses = [cl.myModal];
    if(visible) {
        rootClasses.push(cl.active);
    }

    return (
        <div className={rootClasses.join(" ")} onClick={() => setVisible(false)}>
            <div className={cl.myModalContent} onClick={(e) => e.stopPropagation()}>
            <div className="d-flex justify-content-end">
                    <Button 
                        className="d-flex align-items-center  justify-content-center"
                        style={{padding: 7, width: 25, height: 25, marginBottom: 25}}
                        variant="warning"
                        onClick={() => setVisible(false)}
                    > 
                        <span>X</span>
                    </Button>
                </div>
                {children}
            </div>
        </div>
    )
}