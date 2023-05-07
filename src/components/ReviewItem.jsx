import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Service } from "../API/Service";
import { useFetching } from "../hooks/useFetching";
import { Card,  Col,  Container,  ListGroup, Button} from "react-bootstrap"
import { Context } from "..";
import { observer } from "mobx-react-lite";
import { REVIEW_ROUTE } from "../utils/consts";
import { BasicRating } from "./Rating";
import jwtDecode from "jwt-decode";
import { Spiner } from "./Spinner ";
import { FaThumbsUp } from "react-icons/fa";
import { useMediaQuery } from '@material-ui/core';
import { FaRegHeart } from "react-icons/fa";
export const ReviewItem = observer(({review, userId}) => {
    const token = localStorage.getItem('token');
    let localId;
    if (token) {
        try {
        localId = jwtDecode(token);
        } catch (error) {
        console.log('Invalid token specified');
        }
    }
    const isSmallScreen = useMediaQuery('(max-width:980px)');
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [fetchUser, isUserLoading, userError] = useFetching(async () => {
        await Service.getUserId(userId).then(response => setUsers(response.data));    
              
    });
    const [likes, setLikes] = useState(review.likeCount);
    useEffect(() => {
        fetchUser()
    }, [])

    return (
        <Col md={isSmallScreen ? 6 : 4} className="mb-4">
            {isUserLoading
                ? <Spiner/>
                :
                    <Card  
                        key={review.id}
                    >
                    <Card.Img  
                        variant="top" 
                        src={ review?.images[0]?.pathToCloudStorage ?? 'https://res.cloudinary.com/duy8ow4xu/image/upload/v1683203613/vjxqwmjrpkstnnnlujoa.jpg'} 
                    />
                    <Card.Body>
                        <Card.Title className="d-flex flex-column align-items-center "> 
                            {review?.title} 
                        </Card.Title>
                        </Card.Body>
                            <ListGroup className="list-group-flush">
                            <ListGroup.Item className="card_aftor">
                                <span style={{fontWeight: 'bold'}}>Автор: {users?.name} </span> 
                                <div className="card_aftor_icon">
                                    <FaThumbsUp
                                        className="btn_like"
                                        color="#FFB6C1" 
                                    />
                                    {users?.likeCount ? users?.likeCount : 0}
                                </div>
                            </ListGroup.Item>
                            <ListGroup.Item>
                            <span style={{fontWeight: 'bold'}}>{review?.types[0]?.name}: </span>{review?.products[0]?.name}
                                <BasicRating 
                                    value={review?.products[0]?.averageRating} 
                                    userId={localId?.id} 
                                    productId={review?.products[0]?.id}
                                />
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <span style={{fontWeight: 'bold'}}>Дата публекации:</span> {review?.createReview.split(',')[0]}
                            </ListGroup.Item>

                            <ListGroup.Item className="align-items-center">
                                <span style={{fontWeight: 'bold'}}>Теги:</span> {review?.tags.map(tag => <div className="tag_item">{tag.name}</div>)}
                            </ListGroup.Item>

                            </ListGroup>
                        <Card.Body>
                        <Button 
                        variant="outline-warning"
                        className="w-50"
                            onClick={() => navigate(REVIEW_ROUTE + '/' + review.id)}
                        >
                            Обзор
                        </Button>
                        <Button 
                        onClick={() => {
                            Service.like(review.id, localId.id)
                                .then(data => {
                                    if (data) {
                                        setLikes(likes + 1);
                                    }
                                })
                                .catch(error => {
                                    if (error.response && error.response.status === 400) {
                                        console.log('Ошибка 400: Bad Request');
                                    }
                                });
                        }}
                        className="w-50"
                        variant="outline-danger"><FaRegHeart/> {likes}</Button>
                    </Card.Body>
                </Card>
            }
        </Col>
    )
})