import { useContext, useState } from "react"
import { Button, NavDropdown } from "react-bootstrap"
import { Context } from "../..";
import { observer } from "mobx-react-lite";
import "../../NavBar.css"
export const NavDropdownType = observer(() => {
    const [type, setType] = useState('Категория');
    const {review} = useContext(Context);
    return (
        <NavDropdown 
            id="Nav_Dropdown" 
            title={type} 
        >
            {review.types.map(item => (
                <NavDropdown.Item onClick={() => {
                    setType(item.name)
                    review.setSelectedType(item)
                }} key={item.id}>{item.name}</NavDropdown.Item>
            ))}
             <NavDropdown.Divider />
            <NavDropdown.Item onClick={() => {
                    setType('Всё')
                    review.setSelectedType(0)
                }}>Всё</NavDropdown.Item>
        </NavDropdown>  
    )
})

export const NavDropdownLanguage = () => {
    const  [language, setLanguage] = useState('Язык');
    return(
        <NavDropdown 
            id="Nav_Dropdown" 
            title={language}
        >
            <NavDropdown.Item  onClick={() => (setLanguage('Русский'))}>Русский</NavDropdown.Item>
            <NavDropdown.Item onClick={() => (setLanguage('English'))}>English</NavDropdown.Item>
        </NavDropdown>
    );
}