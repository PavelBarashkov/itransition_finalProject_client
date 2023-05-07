import { Container } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import ReactMarkdown from 'react-markdown';

export const Comment = ({review, userId}) => {
  return (
      <Container style={{padding: 0}}>
        <h4>Комментарии</h4>
        {review?.comments &&review?.comments.length > 0 
          ?
            review?.comments?.map(data => 
              <Card className='mb-3'>
                  <Card.Header className='blockquote'>{userId}</Card.Header>
                  <Card.Body>
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
            <div>Комментарии отсутствуют</div>
        }
      </Container>
  );
}
