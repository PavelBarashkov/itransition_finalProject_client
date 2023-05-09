import { Container } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import ReactMarkdown from 'react-markdown';
import { useTranslation } from "react-i18next";

export const Comment = ({review, userId}) => {
    const {t} = useTranslation(["review"])

  return (
      <Container style={{padding: 0}}>
        <h4 id="text">{t("comments")}</h4>
        {review?.comments &&review?.comments.length > 0 
          ?
            review?.comments?.map(data => 
              <Card className='mb-3'>
                  <Card.Header className='blockquote comment_header'>{userId.name}</Card.Header>
                  <Card.Body className='comment_body'>
                    <blockquote className="mb-0" >
                      <p>
                        {' '}
                      <ReactMarkdown>{data && data?.body}</ReactMarkdown> 
                        {' '}
                      </p>
                      <footer className="blockquote-footer mt-0 mb-0">
                          <cite title="Source Title">{data?.createComment}</cite>
                      </footer>
                    </blockquote>
                  </Card.Body>
                </Card> )
          :
            <div id="text">{t("noComments")}</div>
        }
      </Container>
  );
}
