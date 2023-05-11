import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { Context } from "..";
import { Row, Col } from "react-bootstrap";
import { ReviewItem } from "./ReviewItem";


export const ReviewList = observer(({fetchReview}) => {
    const {review} = useContext(Context);


    return (
        <Row className="d-flex">
            {review && review.reviews.map((review) => (
                <ReviewItem key={review.id} review={review} userId={review.userId} fetchReview={fetchReview}/>
            ))}
        </Row>
      );
    });
    export const ReviewListSearch = observer(() => {
        const { review } = useContext(Context);
        return (
            <Row className="d-flex">
                {review && review.listSearch.length > 0 ? (
                    review.listSearch.map((review) => (
                        <ReviewItem key={review.id} review={review} userId={review.userId} />
                    ))
                ) : (
                    <Col id='text' style={{textAlign: 'center'}} md={12}>нет обзоров</Col>
                )}
            </Row>
        );
    })
    
