import { Container, Row, Col } from "react-bootstrap"
import { ReviewCard } from "../components/ReviewItem"
import { useContext, useEffect, useState } from "react"
import { Service } from "../API/Service"
import { useFetching } from "../hooks/useFetching"
import { Context } from ".."
import { ReviewList } from "../components/ReviewList"
import { observer } from "mobx-react-lite"
import { NavDropdownType } from "../components/Header/NavDropdown"
import { Tags } from "../components/Tags"
import { Pages } from "../components/Pages"
import { useTranslation } from "react-i18next";


export const Main = observer(() => {
    const {review} = useContext(Context);
    const {t} = useTranslation(["common"])
    // const pageSize = window.innerWidth < 1000 ? 2 : 3;
    const [fetchReview, isReviewsLoading, reviewsError] = useFetching(async () => {
        
        await Service.getReviews(review.selectedType ? review.selectedType.id : null, review.selectedTag.map(item => item.id), review.page, 3).then(data => {
            review.setReviews(data.rows)
            review.setTotalCount(data.count);
        });
        
    })
    
    

    const [tags, setTags] = useState(null)
    useEffect(() => {
        fetchReview();
    }, [])

    useEffect(() => {
        fetchReview()
    }, [review.page, review.selectedType, review.selectedTag])

    return (
        <Container style={{marginTop: '45px'}}>
            <Row className="d-flex align-items-start">
                <Col md={3}>
                    <Tags 
                        setTags={setTags} 
                        tags={tags}
                    />
                </Col>
                <Col md={9} >
                    {review.reviews && review.reviews.length > 0 
                        ? (
                            <ReviewList fetchReview={fetchReview}/>
                        ) 
                        : (
                            <Col style={{textAlign: 'center'}} md={12}>{t("noReviews")}</Col>
                        )}
                    <Pages/>
                </Col>
            </Row>
        </Container>
    )
})