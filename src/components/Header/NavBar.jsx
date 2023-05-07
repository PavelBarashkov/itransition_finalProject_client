import React, { useContext, useEffect, useState } from "react";
import {Navbar, Container, Nav, Form, Button} from "react-bootstrap";
import { MyModal } from "../../components/UI/MyModal";
import { Login } from "../../components/Auth/Login";
import { NavDropdownType, NavDropdownLanguage } from "./NavDropdown";
import { useFetching } from "../../hooks/useFetching";
import { Service } from "../../API/Service"
import { Context } from "../..";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { ADMIN_ROUTE, HOME_ROUTE, MAIN_ROUTE } from "../../utils/consts";
import jwtDecode from "jwt-decode";
import { SwitchTheme } from "../SwitchTheme";
import "../../NavBar.css"


export const NavBar = observer(() => {

  const token = localStorage.getItem('token');
  let localId;
  if (token) {
      try {
          localId = jwtDecode(token);
      } catch (error) {
          console.log('Invalid token specified');
      }
  }

  const [modal, setModal] = useState(false);
  const [navMargin, setNavPading] = useState(false);


  const {review} = useContext(Context);
  const {user} = useContext(Context);
  const navigate = useNavigate();

  const [fetchType, isTypeLoading, typeError] = useFetching(async()=> {
    const response = await Service.getTypes();    
    review.setTypes(response.data)
  })





  const logOut = () => {
    user.setUser({})
    user.setIsAuth(false)
    localStorage.removeItem('token')
}
  
  useEffect(() => {
    fetchType();
  }, []);



    return (
      <Navbar bg="dark" variant="dark" expand="lg" onToggle={setNavPading}>
        <Container >
          <Navbar.Brand href="#home" onClick={() => navigate(MAIN_ROUTE)}>Navbar</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav"/>
          <Navbar.Collapse id="basic-navbar-nav">
            <Form className="d-flex">
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
              />
              <Button variant="outline-success">Search</Button>
            </Form>
            <Nav className="ms-auto my-2 my-lg-0 gap-2  align-items-center">
              <SwitchTheme/>
              <Button
                style={{border: 'none'}}
                className="p-0"
                variant="outline-secondary"
              >
                <NavDropdownType />
              </Button>
              <Button
                style={{border: 'none'}}
                className="p-0"
                variant="outline-secondary"
              >
                <NavDropdownLanguage id="Nav_Dropdown_Language"/>
                </Button>
              
              <Nav.Link href="#home">
                
              </Nav.Link>
              {user.isAuth 
                ?
                  <Nav className="d-flex gap-2" > 
                    <Button 
                      style={{border: 'none'}}
                      variant="outline-secondary" 
                      onClick={() => navigate(HOME_ROUTE + '/' + localId.id)}
                    >
                      Своя страница
                   </Button>
                    <Button 
                      style={{border: 'none'}}
                      variant="outline-secondary"
                      onClick={() => navigate(ADMIN_ROUTE)}
                    >
                      Админ панель
                   </Button>
                   <Button 
                      style={{border: 'none'}}
                      variant="outline-danger"
                      onClick={() => logOut()}
                    >
                      Выйти
                   </Button> 
                  </Nav>
                :
                <Nav>
                  <Button 
                      variant="outline-success"
                      onClick={() => setModal(true)}
                    >
                      Войти
                   </Button>
                  <MyModal visible={modal} setVisible={setModal}>
                    <Login/>
                  </MyModal>
                </Nav>
              }
              
            </Nav>

          </Navbar.Collapse>
          
        </Container>
      </Navbar>
    )
})