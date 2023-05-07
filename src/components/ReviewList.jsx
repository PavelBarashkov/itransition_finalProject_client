import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { Context } from "..";
import { Row } from "react-bootstrap";
import { ReviewItem } from "./ReviewItem";


export const ReviewList = observer(() => {
    const {review} = useContext(Context);

    const sortedReviews = [...review?.reviews ?? []].sort((a, b) => {
        if(a.likeCount !== b.likeCount) {
            return b.likeCount - a.likeCount;
        }
        if(a.products[0].averageRating !== b.products[0].averageRating ) {
            return b.products[0].averageRating  - a.products[0].averageRating ;
        } 
        if (new Date(a.createReview) !== new Date(b.createReview)) {
            return new Date(b.createReview) - new Date(a.createReview);
        }
        return a.id - b.id;
      });
    

    return (
        <Row className="d-flex">
            {review && review.reviews && sortedReviews && sortedReviews.map((review) => (
                <ReviewItem key={review.id} review={review} userId={review.userId} />
            ))}
        </Row>
      );
    });
