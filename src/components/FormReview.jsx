import { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, FloatingLabel, Card , ListGroup} from "react-bootstrap";
import { MuiFileInput } from 'mui-file-input';
import { Service } from "../API/Service";
import { useFetching } from "../hooks/useFetching";
import { Product } from "./Product";
import { Tags } from "../components/Tags";
import { Spiner } from "./Spinner ";
import { Alert } from "./Alert";
export const FormReview = ({ review, localId, ...props}) => {

    // State
    const [title, setTitle] = useState('');
    // const [name, setName] = useState('');
    const [textReview, setTextReview] = useState('');
    const [authorsAssessment, setAuthorsAssessment] = useState(1);
    const [category, setCategory] = useState(review?.reviewId ? review?.reviewId?.types.name : '');
    const [tags, setTags] = useState(null);
    const [product, setProduct] = useState(null);
    const [file, setFile] = useState(null);
    const [imgUrl, setImgUrl] = useState('');
    const [dragEnter, setDragEnter] = useState(false);
    const [validated, setValidated] = useState(false);
    const [picture, setPicture] = useState(null)
    const [editPicture, setEditPicture] = useState(null)
    const [editImg, setEditImg] = useState(review?.reviewId ? review?.reviewId?.images[0].id : '')
    const [alert, setAlert] = useState(null);

    // Constants
    const number = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    // Effects
    useEffect(() => {
        setEditPicture(review?.reviewId?.images && review.reviewId.images[0]?.pathToCloudStorage )
        setCategory(review.reviewId && review?.reviewId?.types[0]?.name);
        setTags(review.reviewId && review.reviewId.tags);
        setEditImg(review?.reviewId && review?.reviewId?.images[0].id);    
        setTitle(review.reviewId && review.reviewId.title);
        setTextReview(review.reviewId && review.reviewId.body);
        setAuthorsAssessment(review.reviewId && review.reviewId.rating);
    }, [review.reviewId]);
    useEffect(() => {
        fetchProduct(); 
        
    }, []);


    useEffect(() => {
        if (alert) {
            const timer = setTimeout(() => {
                removeAlert();
            }, 5000);
    
            return () => clearTimeout(timer);
        }
    }, [alert]);
    
    
    // Event handlers
    const selectFile = newFile => {
        setFile(newFile);
    };
    const [fetchPicture, isPictureLoading, pictureError] = useFetching(async (data) => {
        await Service.uploadImg(data).then(data => {
            setImgUrl(data.data);
            setPicture(data.data.data.url); 
            setEditPicture(data.data.data.url)
        });   
              
    });

    const addImg = (newFile) => {
        const formData = new FormData();
        formData.append('file', newFile);
        fetchPicture(formData)
    };

    function dragEnterHandler(event) {
        event.preventDefault();
        event.stopPropagation();
        setDragEnter(true);
    }

    function dragLeaveHandler(event) {
        event.preventDefault();
        event.stopPropagation();
        setDragEnter(false);
    }

    function dropHandler(event) {
        event.preventDefault();
        event.stopPropagation();
        const newFile = event.dataTransfer?.files[0];
        setFile(newFile);
        setDragEnter(false);
        addImg(newFile)
    }

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
            setValidated(true);

        } else {
            event.preventDefault();
            setValidated(false);
            setTitle('');
            setTextReview('');
            setTags(null);
            setAuthorsAssessment(1);
            review.setSelectedType(null);
            review.setSelectedTag(null);
        }
    };

    // Fetching
    const [fetchProduct, isProductLoading, productError] = useFetching(async () => {
    await Service.getProducts().then(data => review.setProduct(data.data));
    });



    const handleReview = (action) => {
        if (action === 'create') {
          Service.createReview(
            imgUrl?.data?.id,
            review.selectedType,
            title,
            review.selectedProduct,
            textReview,
            authorsAssessment,
            localId ,
            review.selectedTag &&  review.selectedTag.map(tag => tag.name)
          )
          .then(response => {
            setAlert({ data: `Обзор: ${response.data.title} успешно создан`});
            props.fetchReviews()
          })
          .catch(error => {
            if (error.response && error.response.status === 404) {
              setAlert({ data: error.response.data.message, status: error.response.status});
            }   
          });
        } else if (action === 'update') {
          Service.updateReview(
            review.reviewId.id,  
            title,
            review.selectedProduct,
            textReview,
            authorsAssessment,
            review.selectedTag && review.selectedTag.map(tag => tag.name),
            review.selectedType,
            imgUrl? imgUrl?.data?.id : editImg,
          )
          .then(response => {
            console.log(response)
            setAlert({ data: `Обзор: ${response.title} успешно обновлен`});
            props.fetchReviews()
          })
          .catch(error => {
            if (error.response && error.response.status === 404) {
              setAlert({ data: error.response.data.message, status: error.response.status});
            }   
          });
        }
      }
    const removeAlert = () => {
        setAlert(null);
    };
    
  

   

    return ( 
        <Container>
            {!dragEnter
                ?
                <div>
                {review.reviewId
                    ?
                    
                    <Row 
                        className="mt-3" 
                        onDragEnter={dragEnterHandler} 
                        onDragLeave={dragLeaveHandler} 
                        onDragOver={dragEnterHandler}
                    >
                        <Col md={4} className="">
                            {isPictureLoading ? (
                                <Spiner />
                            ) : (
                                <>
                                {editPicture ? (
                                    <Col>
                                    <Card>
                                        <Card.Img src={editPicture} />
                                    </Card>
                                    <MuiFileInput value={file} onChange={(file) => addImg(file)} />

                                    </Col>
                                ) : (
                                    <Card.Body>
                                    <ListGroup className="list-group-flush">
                                        <ListGroup.Item>
                                        <div>
                                            загрузить изображение
                                            <MuiFileInput value={file} onChange={(file) => addImg(file)} />
                                        </div>
                                        </ListGroup.Item>
                                    </ListGroup>
                                    </Card.Body>
                                )}
                                </>
                            )}
                        </Col>


                    <Col
                        md={7} 
                        className=""
                    >
                        <Form 
                            noValidate 
                            validated={validated} 
                            onSubmit={handleSubmit}
                        >
                            <Row 
                                className="mb-3"
                            >
                                <Form.Group as={Col}>
                                    <Form.Label>Название</Form.Label>
                                        <Form.Control 
                                            required
                                            type="text" 
                                            placeholder="Обзор на Кинга" 
                                            value={title}
                                            onChange={event => setTitle(event.target.value)}
                                        />
                                </Form.Group>
    
                                <Form.Group as={Col} >
                                    <Form.Label>Произведения </Form.Label>
                                        <Product 
                                            data={review?.product}
                                        />
                                </Form.Group>
                            </Row>
    
                            <Form.Group className="mb-3" controlId="formGridAddress1">
                                <FloatingLabel controlId="floatingTextarea2" label="Обзор">
                                    <Form.Control
                                        required
                                        as="textarea"
                                        placeholder="Leave a comment here"
                                        style={{ height: '100px' }}
                                        value={textReview}
                                        onChange={event => setTextReview(event.target.value)}
                                    />
                                </FloatingLabel>
                            </Form.Group>
    
                            <Form.Group className="mb-3" controlId="formGridAddress2">
                                <Form.Label>Теги</Form.Label>
                                <Tags tags={tags} setTags={setTags}/>
                            </Form.Group>
    
                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="formGridCity">
                                    <Form.Label>Оценка</Form.Label>
                                    <Form.Select 
                                        required
                                        defaultValue={'Котегория'}
                                        value={authorsAssessment}
                                        onChange={event => setAuthorsAssessment(event.target.value)}
                                    >
                                        <option value="" elected hidden>{'Оценка от Автора'}</option>
                                            {number.map(item => 
                                                <option>{item}</option>
                                                )
                                            }
                                        
                                    </Form.Select>
                                </Form.Group>
    
                                <Form.Group as={Col} controlId="formGridState">
                                    <Form.Label>Категория</Form.Label>
                                    <Form.Select
                                        onChange={(e)=> {
                                            review.setSelectedType(e.target.value)
                                            setCategory(e.target.value)
                                        }}
                                    >
                                        <option 
                                            value="" 
                                            disabled 
                                            selected 
                                            hidden
                                        >
                                            {category}
                                        </option>
                                        {review?.types?.map(item => 
                                            <option value={item.name} key={item.userId}>
                                                {item.name}
                                            </option>
                                        )}
                                    </Form.Select>
                                </Form.Group>
                            </Row>
    
                            <Button 
                                variant="primary" 
                                type="submit"
                                disabled={!title || !textReview}
                                onClick={() => handleReview('update')}
                            >
                                Редоктировать
                            </Button>
                            {alert && <Alert status={alert.status} data={alert.data}/>}

                        </Form>
                    </Col>
                </Row>
                
    
                    :
                    <Row 
                        className="mt-3" 
                        onDragEnter={dragEnterHandler} 
                        onDragLeave={dragLeaveHandler}
                        onDragOver={dragEnterHandler}
                    >
                    <Col md={4} className="">
                        {isPictureLoading ? (
                            <Spiner />
                        ) : (
                            <>
                            {picture ? (
                                <Col>
                                <Card>
                                    <Card.Img src={picture} />
                                    <MuiFileInput value={file} onChange={(file) => addImg(file)} />
                                </Card>

                                </Col>
                            ) : (
                                <Card.Body>
                                <ListGroup className="list-group-flush">
                                    <ListGroup.Item>
                                    <div>
                                        загрузить изображение
                                        <MuiFileInput value={file} onChange={(file) => addImg(file)} />
                                    </div>
                                    </ListGroup.Item>
                                </ListGroup>
                                </Card.Body>
                            )}
                            </>
                        )}
                        </Col>
                
                    <Col md={7} className="">
                    <Form 
                        noValidate 
                        validated={validated} 
                        onSubmit={handleSubmit}
                    >
                            <Row className="mb-3">
                                <Form.Group as={Col}>
                                    <Form.Label>Название</Form.Label>
                                        <Form.Control 
                                            required
                                            type="text" 
                                            placeholder="Обзор на Кинга" 
                                            value={title}
                                            onChange={event => setTitle(event.target.value)}
                                        />
                                </Form.Group>
    
                                <Form.Group as={Col} >
                                    <Form.Label>Произведения </Form.Label>
                                    <Product 
                                        data={review?.product}
                                    />
                                </Form.Group>
                            </Row>
    
                            <Form.Group className="mb-3">
                                <FloatingLabel label="Обзор">
                                    <Form.Control
                                        required
                                        as="textarea"
                                        placeholder="Leave a comment here"
                                        style={{ height: '100px' }}
                                        value={textReview}
                                        onChange={event => setTextReview(event.target.value)}
                                    />
                                </FloatingLabel>
                            </Form.Group>
    
                            <Form.Group className="mb-3">
                                <Form.Label>Теги</Form.Label>
                                <Tags 
                                    tags={tags} 
                                    setTags={setTags}
                                />
                            </Form.Group>
    
                            <Row className="mb-3">
                                <Form.Group as={Col}>
                                    <Form.Label>Оценка</Form.Label>
                                    <Form.Select 
                                        required
                                        defaultValue={'Оценка'}
                                        value={authorsAssessment}
                                        onChange={event => setAuthorsAssessment(event.target.value)}
                                    >
                                        <option 
                                            value="" 
                                            elected 
                                            hidden
                                        >
                                            {authorsAssessment}
                                        </option>
                                        {number.map(item => 
                                            <option>{item}</option>
                                            )
                                        }
                                        
                                    </Form.Select>
                                </Form.Group>
    
                                <Form.Group as={Col}>
                                    <Form.Label>Категория</Form.Label>
                                    <Form.Select 
                                        required
                                        defaultValue={'Котегория'} 
                                        onChange={(e)=> review.setSelectedType(Number(e.target.value))}
                                    >
                                        <option 
                                            value="" 
                                            disabled 
                                            selected 
                                            hidden
                                        >
                                            {'Категория'}
                                        </option>
                                        {review?.types?.map(item => 
                                            <option value={item.id}>
                                                {item.name}
                                            </option>
                                            )
                                        }
                                        
                                    </Form.Select>
                                </Form.Group>
                            </Row>
    
                            <Button 
                                variant="primary" 
                                type="submit"
                                onClick={() => handleReview('create')}
                                disabled={!title || !textReview}
                            >
                                Создать
                            </Button>
                            {alert && <Alert status={alert.status} data={alert.data}/>}
                        </Form>
                    </Col>
                </Row>
                }</div>



                :

                <div 
                    onDrop={dropHandler}  onDragEnter={dragEnterHandler} onDragLeave={dragLeaveHandler} onDragOver={dragEnterHandler}
                    style={{width: '100%', height: "calc(100vh - 50px - 40px)", border: '1px solid black'}}
                >
                    Перетащите сюда файл
                </div>

            }
           
        </Container>
    )
}