import { useContext, useEffect, useState } from "react";
import { Col, Container, Row, FloatingLabel, ButtonToolbar, ButtonGroup } from "react-bootstrap"
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {Context} from "../index"
import { observer } from "mobx-react-lite";
import { Tags } from "../components/Tags"
import { Service } from "../API/Service";
import { useFetching } from "../hooks/useFetching";
import jwtDecode from "jwt-decode";

import { MuiFileInput } from 'mui-file-input'
import { ReviewTable } from "../components/ReviewTable";
import { FormReview } from "../components/FormReview";
import {useNavigate, useParams} from "react-router-dom";
import { MAIN_ROUTE } from "../utils/consts";


export const Home = observer(() => {
    const {review} = useContext(Context);
    const {id} = useParams();
    const navigate = useNavigate();
    const [userAurh, setUserAuth] = useState(false);
    const token = localStorage.getItem('token');
    let localId;
    if (token) {
        try {
            localId = jwtDecode(token);
        } catch (error) {
            console.log('Invalid token specified');
        }
    }

    if (localId && localId.role === 'ADMIN') {
        console.log('Зашел админ')
      } else if (id && localId && localId.id && id != localId.id ) {
        navigate(MAIN_ROUTE);
    }
    
    const [myReviews, setMyReviews] = useState({});
    const [fetchRewiewId, isRewiewIdLoading, rewiewIdError] = useFetching(async ()=> {
        await Service.getReviewsUserId(id).then(data => setMyReviews(data));
    });

   

    useEffect(() => {
        fetchRewiewId()
    }, [review, review.reviewId])


    return (
        <Container>
             <FormReview 
                review={review}
                localId={id}
                fetchReviews={fetchRewiewId}
            />

            <ReviewTable 
                myReviews={myReviews} 
                setMyReviews={setMyReviews} 
                fetchRewiewId={fetchRewiewId}
            />
        </Container>
    )
        
})