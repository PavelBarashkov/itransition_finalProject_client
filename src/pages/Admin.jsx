import { Button, Container, Form, InputGroup, FormCheck } from "react-bootstrap"
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
import { observer } from "mobx-react-lite";
import jwtDecode from "jwt-decode";

export const Admin = observer(() => {
    const token = localStorage.getItem('token');
    let localId;
    if (token) {
        try {
            localId = jwtDecode(token);
        } catch (error) {
            console.log('Invalid token specified');
        }
    }
    const {user} = useContext(Context)
    const navigate = useNavigate()
    const [modalType, setModalType] = useState(false);
    const [modalTag, setModalTag] = useState(false);
    const {t} = useTranslation(["common", "home", "review"]);
    const [type, setType] = useState('');
    const [tag, setTag] = useState('');
    const[checkAll, setCheckAll] = useState(false);

    const [fetchUsers, isUsersLoading, usersError] = useFetching( async() => {
        await Service.getUsers().then(data => user.setUsers(data.data));
    })

    const handleSelectAllChange = () => {
        if (checkAll) {
            setCheckAll(false)
            user?.users.forEach((item) => {
                item.selected = false
            });
        } else {
            setCheckAll(true)
            user?.users.forEach((item) => {
                item.selected = true
            });
        }
    };
    
    const handleSelectChange = (event, item) => {
        item.selected = !item.selected;
        user.setUsers([...user.users])
    }

    const deleteUsers= async (id) => {
        await Service.deleteUserId(id);
            
    };
    const removeUsers = async () => {
        const selectedUsers = user.users.filter((item) => item.selected);
        const deletedUserIds = [];
        for (const review of selectedUsers) {
          try {
            await deleteUsers(review.id);
            setCheckAll(false)
            deletedUserIds.push(review.id);

          } catch (error) {
            console.log(error);
          }
        }
        const updatedUsers = user.users.filter((user) => !deletedUserIds.includes(user.id));
        user.setUsers(updatedUsers);
    }


    const updateRoleUsers = async() => {
        const selectedUsers = user.users.filter((user) => user.selected);
        const blockedUserIds = [];
        for (const person of selectedUsers) {
          try {
            await Service.dataUpdateId(person.id, 'active', 'ADMIN');
            if(person.id === localId.id) {
              return;
            }
            setCheckAll(false)
            blockedUserIds.push(person.id);
          } catch (error) {
            console.log(error);
          }
        }
        fetchUsers();
      };

    const blockUsers = async() => {
        const selectedUsers = user.users.filter((user) => user.selected);
        const blockedUserIds = [];
        for (const person of selectedUsers) {
          try {
            await Service.dataUpdateId(person.id, 'blocked');
            
    
    
            if(person.id === localId.id) {
              return;
            }
            setCheckAll(false)
            blockedUserIds.push(person.id);
          } catch (error) {
            console.log(error);
          }
        }
        fetchUsers();
      };

      const unBlockUsers = async() => {
        const selectedUsers = user.users.filter((user) => user.selected);
        const blockedUserIds = [];
        for (const person of selectedUsers) {
          try {
            await Service.dataUpdateId(person.id, 'active');
            
            setCheckAll(false)
            blockedUserIds.push(person.id);
          } catch (error) {
            console.log(error);
          }
        }
        fetchUsers();
      };



    useEffect(() => {
        fetchUsers();
    }, [])

    return (
        <Container style={{marginTop: '45px', height: "100%"}} className="container_table">
            <div className="btn_create">
            <Button 
                variant="outline-success"
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
                    variant="outline-success"
                    disabled={!type}
                    onClick={() => Service.createType(type).then(data => setModalType(false))}
                >
                    {t("home:create")}
                </Button>
            </MyModal>
            <Button 
                variant="outline-success"
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
                        variant="outline-success"
                        disabled={!tag} 
                        onClick={() => Service.createTag(tag).then(data => setModalTag(false))}
                    >
                        {t("home:create")}
                    </Button>
                </MyModal>
            </div>
          

                <Button style={{marginTop: '20px'}} variant="outline-danger" onClick={() => removeUsers()}>Delete Users</Button>
                <Button style={{marginTop: '20px'}} variant="outline-warning" onClick={() => blockUsers()}>Block User</Button>
                <Button style={{marginTop: '20px'}} variant="outline-success" onClick={() => unBlockUsers()}>UnBlock User</Button>
                <Button style={{marginTop: '20px'}} variant="outline-success" onClick={() => updateRoleUsers()}>Role Admin User</Button>
                <Table striped bordered hover >
                    <thead>
                        <tr>
                        <th>
                            <FormCheck 
                                type="checkbox"  
                                checked={checkAll}
                                onClick={handleSelectAllChange}
                            />
                        </th> 
                        <th>#</th>
                        <th>{t("review:author")}</th>
                        <th>{t("common:email")}</th>
                        <th>{t("common:dateOfRegistration")}</th>
                        <th>Роль</th>
                        <th>{t("common:page")}</th>
                        </tr>
                    </thead>
                    
                        {isUsersLoading
                            ? <Spiner/>
                            :<tbody>
                            {user?.users.map((item, index )=> 
                                <tr>
                                    <th>
                                    <FormCheck 
                                        type="checkbox" 
                                        checked={item.selected} 
                                        onClick={(event) => handleSelectChange(event, item)}
                                    />
                                    </th> 
                                   <td>{index + 1}</td>
                                   <td>{item.name}</td>
                                   <td>{item.email}</td>
                                   <td>{item.registrationDate}</td>
                                   <td>{item.role}</td>
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
})