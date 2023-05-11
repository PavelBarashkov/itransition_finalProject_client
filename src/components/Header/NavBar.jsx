import React, { useContext, useEffect, useState} from "react";
import {Navbar, Container, Nav, Form, Button} from "react-bootstrap";
import { MyModal } from "../../components/UI/MyModal";
import { Login } from "../../components/Auth/Login";
import { NavDropdownType, NavDropdownLanguage } from "./NavDropdown";
import { useFetching } from "../../hooks/useFetching";
import { Service } from "../../API/Service"
import { Context } from "../..";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { ADMIN_ROUTE, HOME_ROUTE, MAIN_ROUTE, SEARCH_ROUTE } from "../../utils/consts";
import jwtDecode from "jwt-decode";
import { SwitchTheme } from "../SwitchTheme";
import "../../NavBar.css"
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../hooks/useTheme";

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
    const {theme, setTheme} = useTheme();
    const handleChange = () => {
        const nextTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(nextTheme);
    };
    const {t} = useTranslation("common");
    const [search, setSearch] = useState([]);

    const [fetchType, isTypeLoading, typeError] = useFetching(async()=> {
        const response = await Service.getTypes();    
        review.setTypes(response.data)
    })
    function getSearch() {
        Service.getSearch(search).then(data => review.setListSearch(data));
        navigate(SEARCH_ROUTE);
        setSearch('')
    }
    
    const logOut = () => {
        user.setUser({})
        user.setIsAuth(false)
        localStorage.removeItem('token')
    }

    useEffect(() => {
        fetchType();
    }, []);
    



    useEffect(() => {
        if(localStorage.getItem('i18nextLng').length > 2) {
            i18next.changeLanguage("en");
        }
    }, [])

    useEffect(() => {
        console.log(review.listSearch)
    }, [review.listSearch]);

    return (
        <Navbar bg="dark" variant="dark" expand="lg" onToggle={setNavPading}>
            <Container>
            <Navbar.Brand 
                href="#home" 
                onClick={() => navigate(MAIN_ROUTE)}
            >
                {t("read")}
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav"/>
            <Navbar.Collapse id="basic-navbar-nav">
                <Form className="d-flex">
                    <Form.Control
                        type="search"
                        placeholder={t("search")}
                        className="me-2"
                        aria-label="Search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Button 
                        variant="outline-success"
                        disabled={!search}
                        onClick={() => getSearch()}
                        onKeyDown={(event) => {if(event.keyCode === 13) {
                            getSearch()
                        }}}
                    >
                        {t("search")}
                    </Button>
                </Form>
                <Nav className="ms-auto my-2 my-lg-0 gap-2  align-items-center">
                    <SwitchTheme checked={theme === 'dark'} onChange={handleChange}/>
                        <NavDropdownType/>

                    <NavDropdownLanguage id="Nav_Dropdown_Language"/>
            {user.isAuth 
                ?
                <Nav className="d-flex gap-2" > 
                    <Button 
                    style={{border: 'none'}}
                    variant="outline-secondary" 
                    onClick={() => navigate(HOME_ROUTE + '/' + localId.id)}
                    >
                    {t("homePage")}
                </Button>
                    {localId.role === "ADMIN" && (
                        <Button 
                            style={{border: 'none'}}
                            variant="outline-secondary"
                            onClick={() => navigate(ADMIN_ROUTE)}
                        >
                            {t("administrativePanel")}
                        </Button>
                    )}
                
                <Button 
                    style={{border: 'none'}}
                    variant="outline-danger"
                    onClick={() => logOut()}
                    >
                    {t("exit")}
                </Button> 
                </Nav>
                :
                <Nav>
                <Button     
                    style={{whiteSpace: 'nowrap'}}
                    variant="outline-success"
                    onClick={() => setModal(true)}
                    >
                    {t("signIn")}
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