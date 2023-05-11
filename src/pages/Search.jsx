    import { useContext, useEffect } from "react"
    import { Container, Row, Col } from "react-bootstrap"
    import { Context } from ".."
    import { ReviewList, ReviewListSearch } from "../components/ReviewList"


    export const Search = () => {
        const {review} = useContext(Context);


        return (
            <Container >
                <Row >
                    <Col md={8}>
                        <ReviewListSearch />
                    </Col>
                </Row>
            </Container>
        )
    }