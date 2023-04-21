import React, { useState } from "react";
import {Navbar, Container, Nav, Form, Button, NavDropdown} from "react-bootstrap";
import { MyModal } from "./UI/MyModal";
import { Login } from "./Login";

export const NavBar = () => {

  const [modal, setModal] = useState(false);
  const [navMargin, setNavPading] = useState(false);

  const menuToggle = navMargin ? "2em" : '0'

    return (
      <Navbar bg="dark" variant="dark" expand="lg" onToggle={setNavPading}>
        <Container >
          <Navbar.Brand href="#home">Navbar</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav"/>
          <Navbar.Collapse id="basic-navbar-nav">
            <Form className="d-flex" style={{marginTop: menuToggle}}>
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
              />
              <Button variant="outline-success">Search</Button>
            </Form>
            <Nav className="ms-auto my-2 my-lg-0">
              <NavDropdown title="Категории" id="collasible-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">Фильмы</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">Книги</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">Игры</NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title="Язык" id="collasible-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">Русский</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">English</NavDropdown.Item>
              </NavDropdown>
              <Nav.Link href="#home">
                  {/* <Form.Check 
                      type="switch"
                      id="custom-switch"
                      label="Тема"
                  /> */}
              </Nav.Link>
              <Nav.Link  onClick={() => setModal(true)}> Войти
                <MyModal visible={modal} setVisible={setModal}>
                  <Login/>
                </MyModal>
              </Nav.Link>
            </Nav>

          </Navbar.Collapse>
          
        </Container>
      </Navbar>
    )
} 