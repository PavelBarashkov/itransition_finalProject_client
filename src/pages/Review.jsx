import React, { useRef } from "react";
import { observer } from "mobx-react-lite";
import {useParams} from "react-router-dom";
import { useFetching } from "../hooks/useFetching";
import { Service } from "../API/Service";
import { useEffect, useState } from "react";
import { Container, Col, Card, ListGroup, Button, Row } from "react-bootstrap";
import "../App.css"
import { Comment } from "../components/Comment";
import { FaThumbsUp } from "react-icons/fa";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import jwtDecode from "jwt-decode";
import { entries } from "mobx";
import {BasicRating} from "../components/Rating"
import ReactMarkdown from 'react-markdown';
import { FaRegHeart } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { ReviewList } from "../components/ReviewList";


export const Review = observer(() => {
    const wsConnection = new WebSocket('wss://itransitionfinalprojectserver-production.up.railway.app');
    const {t} = useTranslation(["review", "home"])
    const {id} = useParams();
    const token = localStorage.getItem('token');
    let localId;
    if (token) {
        try {
            localId = jwtDecode(token);
        } catch (error) {
            console.log('Invalid token specified');
        }
    }
    const [likes, setLikes] = useState(0 );
    const [commentValue, setCommentValue] = useState('');
    const [review, setReview] = useState({});
    const [reviewsProduct, setReviewsProduct] = useState([]);
    const [fetchRewiewId, isRewiewIdLoading, rewiewIdError] = useFetching(async ()=> {
        await Service.getRewiewId(id).then(response => {
            setReview(response)
            setLikes(response.likeCount)
        });
    });
    const [users, setUsers] = useState([]);
    const [fetchUser, isUserLoading, userError] = useFetching(async () => {
        if(review?.userId) {
            await Service.getUserId(review.userId).then(response => setUsers(response.data));    
        }
            
    });

   
    const [fetchreviewsProduct, isReviewsProductLoading, reviewsProductError] = useFetching(async () => {
        if(review?.userId) {
            await Service.getReviewForProduct(review?.products[0]?.id).then(response => setReviewsProduct(response));    
        }
            
    });

    const sendComment =  async() => {
        await Service.sendComment(localId.id, localId.name, Number(id), commentValue);
        setCommentValue('');
        fetchRewiewId();
        wsConnection.send(JSON.stringify({
            event: 'message',
            id: id,
            body: commentValue
        }));
        
    }


    useEffect(() => {
        fetchRewiewId();
        window.scrollTo(0, 0);
    }, [id]);

    useEffect(() => {
        fetchUser()
        fetchreviewsProduct();
    }, [review]);

    useEffect(() => {
        wsConnection.onopen = () => {
            const message = {
                event: 'connection',
            }
            if (wsConnection.readyState === WebSocket.OPEN) {
                wsConnection.send(JSON.stringify(message))
            }
            console.log("Соединение установлено.");
        }

        
        wsConnection.onmessage = (e) => {
            const message = JSON.parse(e.data);
            if(message?.event === 'message') {
                fetchRewiewId();
            }
        }

        wsConnection.onclose = () => {
            console.log('Socket закрыт')
        }

        wsConnection.onerror = () => {
            console.log('Socket ошибка')
            
        }
    })
    return (
        <Container style={{marginTop: '45px'}}>
            <h1 className="title_review">
                {review?.products && review?.products[0]?.name}
            </h1>
        
            <Row className="mt-3 mb-5">
                <Col md={4}>
                    <Card  key={review.id} className="card_item_review">
                    <Card.Img  
                        variant="top" 
                        src={(review?.images && review.images[0]?.pathToCloudStorage) ?? 'https://res.cloudinary.com/duy8ow4xu/image/upload/c_pad,b_auto:predominant,fl_preserve_transparency/v1682329996/wfk8yzc7xrlvadr3trwn.jpg?_s=public-apps'} 
                    />
                    <BasicRating 
                        localId={localId}
                        value={review?.products && review?.products[0]?.averageRating} 
                        userId={localId?.id} 
                        productId={review?.products && review?.products[0]?.id}
                        fetchReview={fetchRewiewId}
                    />
                    </Card>
                </Col>
                <Col className="review_info" md={7}>

                    <Card.Title 
                        style={{fontWeight: 'bold', fontSize: '22px'}}
                    >
                        {review?.title}
                    </Card.Title>

                    <ListGroup.Item>
                    <span style={{fontWeight: 'bold'}}>
                            {t("home:category")} : 
                        </span>  {
                            review?.types && review?.types[0] ?
                            review?.types[0]?.name === "Кино" ? t("common:cinema" ) :
                            review?.types[0]?.name === "Книги" ? t("common:book") :
                            review?.types[0]?.name === "Сериалы" ? t("common:series") :
                            t(review?.types[0]?.name) || review?.types[0]?.name : t("home:category")
                        } 
                        
                                
                            
                    </ListGroup.Item>
                    <ListGroup.Item className="card_aftor card_aftor--review">
                                <span style={{fontWeight: 'bold'}}>{t("review:author")}: {users?.name} </span> 
                                <div className="card_aftor_icon">
                                    <FaThumbsUp
                                        className="btn_like"
                                        color="#FFB6C1" 
                                    />
                                    {users?.likeCount ? users?.likeCount : 0}
                                </div>
                            </ListGroup.Item>
                    <ListGroup.Item>
                        <span style={{fontWeight: 'bold'}}> {t("review:authorRating")}:</span> {review?.rating}
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <span 
                            style={{fontWeight: 'bold'}}
                        > 
                            {t("home:tags")}: 
                        </span> 
                        {review?.tags && review.tags.map(tag => 
                            <div className="tag_item">
                                {tag.name === "Новые" ? t("common:new") : 
                                        tag.name === "Старые" ? t("common:old") :
                                        tag.name === "Крутые" ? t("common:nice") :
                                        tag.name === "Любимые" ? t("common:favorite") :
                                        t(tag.name) || tag.name}
                            </div>)
                        }
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <span style={{fontWeight: 'bold'}}>{t("review:publicationDate")}: </span>{review?.createReview && review?.createReview.split(',')[0]}
                    </ListGroup.Item>

                    <Card.Text className="text_review">
                    
                        <ReactMarkdown children={review?.body}/>
                        
                    </Card.Text>
                    <Button 
                        disabled={!localId?.id}
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
                        className="w-25"
                        variant="outline-danger"><FaRegHeart/> {likes}</Button>
                </Col>
                
            </Row>
            <Comment review={review} userId={localId}/>
            {localId && (
                <FloatingLabel id="text" label={t("comment")}>
                <Form.Control
                    disabled={!localId?.id}
                    className="form_comment"
                    as="textarea"
                    placeholder="Leave a comment here"
                    style={{ height: '100px' }}
                    value={commentValue}
                    onChange={event => setCommentValue(event.target.value)}
                    onKeyDown={(event) => {if(event.keyCode === 13) {
                        sendComment()
                    }}}

                />
                <Button 
                    disabled={!localId?.id  || !commentValue}
                    style={{marginTop: '20px', marginBottom: '20px'}}
                    variant="outline-success"
                    onClick={() => sendComment()}
                >
                    {t("review:send")}
                </Button>
            </FloatingLabel>
            )}

            <ReviewList  reviews={reviewsProduct}/>
            
        </Container>
    )

})