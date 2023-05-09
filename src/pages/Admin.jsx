import { Button, Container, Form, InputGroup } from "react-bootstrap"
import { MyModal } from "../components/UI/MyModal"
import { useContext, useEffect, useState } from "react"
import { Service } from "../API/Service";
import Table from 'react-bootstrap/Table';
import { useFetching } from "../hooks/useFetching";
import { Context } from "..";
import { useNavigate } from "react-router-dom";
import { HOME_ROUTE } from "../utils/consts";
import { Spiner } from "../components/Spinner ";
import { useTranslation } from "react-i18next";

export const Admin = () => {
    const {user} = useContext(Context)
    const navigate = useNavigate()
    const [modalType, setModalType] = useState(false);
    const [modalTag, setModalTag] = useState(false);
    const {t} = useTranslation(["common", "home", "review"]);
    const [type, setType] = useState('');
    const [tag, setTag] = useState('');

    const [fetchUsers, isUsersLoading, usersError] = useFetching( async() => {
        await Service.getUsers().then(data => user.setUsers(data.data));
    })

    useEffect(() => {
        fetchUsers();
    }, [])

    return (
        <Container style={{marginTop: '45px', height: "100%"}} className="container_table">

            <Button 
                style={{marginRight: '20px'}}
                onClick={() => setModalType(true)}
            >
                {t("common:createCategory")}
            </Button>
            <MyModal 
                visible={modalType} 
                setVisible={setModalType}
            >
            <Form.Label >{t("common:moviesBooksEtc")}</Form.Label>
                <InputGroup className="mb-3">
                    <InputGroup.Text>
                        {t('home:title')}
                    </InputGroup.Text>
                    <Form.Control 
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                    />
                </InputGroup>
                <Button 
                    disabled={!type}
                    onClick={() => Service.createType(type)}
                >
                    {t("home:create")}
                </Button>
            </MyModal>
            <Button 
                onClick={() => setModalTag(true)}
            > 
                {t("common:createTag")}
            </Button>
            <MyModal 
                visible={modalTag} 
                setVisible={setModalTag}
            >
                <Form.Label >{t("common:newOldEtc")}</Form.Label>
                    <InputGroup className="mb-3">
                        <InputGroup.Text>
                            {t('home:title')}
                        </InputGroup.Text>
                        <Form.Control 
                            value={tag}
                            onChange={(e) => setTag(e.target.value)}
                        />
                    </InputGroup>
                    <Button 
                        disabled={!tag} 
                        onClick={() => Service.createTag(tag)}
                    >
                        {t("home:create")}
                    </Button>
                </MyModal>


                <Table striped bordered hover style={{height: '100vh'}}>
                    <thead>
                        <tr>
                        <th>#</th>
                        <th>{t("review:author")}</th>
                        <th>{t("common:email")}</th>
                        <th>{t("common:dateOfRegistration")}</th>
                        <th>{t("common:page")}</th>
                        </tr>
                    </thead>
                    
                        {isUsersLoading
                            ? <Spiner/>
                            :<tbody>
                            {user?.users.map((item, index )=> 
                                <tr>
                                   <td>{index + 1}</td>
                                   <td>{item.name}</td>
                                   <td>{item.email}</td>
                                   <td>{item.registrationDate}</td>
                                   <td>
                                        <Button onClick={() => navigate(HOME_ROUTE + '/' + item.id)}>
                                            Перейти
                                        </Button>
                                   </td>

                                </tr>
                               
                           )}
                             </tbody>

                        }
                </Table>
        </Container>
    )
}