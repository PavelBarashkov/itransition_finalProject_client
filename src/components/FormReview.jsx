import { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, FloatingLabel, Card , ListGroup} from "react-bootstrap";
import { MuiFileInput } from 'mui-file-input';
import { Service } from "../API/Service";
import { useFetching } from "../hooks/useFetching";
import { Product } from "./Product";
import { Tags } from "../components/Tags";
import { Spiner } from "./Spinner ";
import { Alert } from "./Alert";

import { useTranslation } from "react-i18next";
import { observer } from "mobx-react-lite";

export const FormReview = observer(({ review, localId, ...props}) => {
    const {t} = useTranslation(["home"])
    // State
    const [title, setTitle] = useState('');
    // const [name, setName] = useState('');
    const [textReview, setTextReview] = useState('');
    const [authorsAssessment, setAuthorsAssessment] = useState(0);
    const [category, setCategory] = useState(review?.reviewId ? review?.reviewId?.types.name : '');
    const [tags, setTags] = useState(null);
    const [product, setProduct] = useState(null);
    const [file, setFile] = useState(null);
    const [imgUrl, setImgUrl] = useState('');
    const [dragEnter, setDragEnter] = useState(false);
    const [validated, setValidated] = useState(false);
    const [picture, setPicture] = useState(null)
    const [editPicture, setEditPicture] = useState(null)
    const [editImg, setEditImg] = useState(null)
    const [alert, setAlert] = useState(null);
    const [test, setTest] = useState(null)
    // Constants
    const number = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    // Effects
    useEffect(() => {
        setEditPicture(review?.reviewId?.images && review.reviewId.images[0]?.pathToCloudStorage )
        setCategory(review.reviewId && review?.reviewId?.types[0]?.name);
        setTags(review.reviewId && review.reviewId.tags);
        setEditImg(review?.reviewId && review?.reviewId?.images[0]?.id);    
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
        event.preventDefault();
        event.stopPropagation();
        const form = event.currentTarget;
        if (alert) {
            return;
        }
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
            setValidated(true);
        } else {
            setTitle('');
            setTextReview('');
            setTags(null);
            setAuthorsAssessment(0);
            review.setSelectedType(null);
            review.setSelectedTag(null);
            setTest('')
        }
};

    // Fetching
    const [fetchProduct, isProductLoading, productError] = useFetching(async () => {
    await Service.getProducts().then(data => review.setProduct(data.data));
    });



    const handleReview = (action) => {
        if (!review.selectedType) {
            setAlert({ data: 'Выберите категорию', status: 404 });
            console.log(alert)
            return;
        }
        if (!review.selectedProduct) {
            setAlert({ data: 'Выберите Произведение', status: 404 });
            return;
        }
        if (action === 'create') {
            if(!review.selectedType || !review.selectedProduct) {
                return
            }
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
            imgUrl? imgUrl?.data?.id : editImg || null,
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
                        <Col md={4} className="" style={{padding: 0}}>
                            {isPictureLoading ? (
                                <Spiner />
                            ) : (
                                <>
                                {editPicture ? (
                                    <Col>
                                    <Card className="form_img">
                                        <Card.Img src={editPicture} />
                                    </Card>
                                    <MuiFileInput className="form_img" value={file} onChange={(file) => addImg(file)} />

                                    </Col>
                                ) : (
                                    <Card.Body>
                                    <ListGroup className="list-group-flush form_img">
                                        <ListGroup.Item className="form_img">
                                        <div>
                                            {t("uploadImage")}
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
                                    <Form.Label id='text'>{t('title')}</Form.Label>
                                        <Form.Control 
                                            required
                                            className="form_title"
                                            type="text" 
                                            value={title}
                                            onChange={event => setTitle(event.target.value)}
                                        />
                                </Form.Group>
    
                                <Form.Group as={Col} >
                                    <Form.Label id='text' >{t("product")}</Form.Label>
                                        <Product 
                                            data={review?.product}
                                        />
                                </Form.Group>
                            </Row>
    
                            <Form.Group className="mb-3" controlId="formGridAddress1">
                                <FloatingLabel id="text" label={t("review")}>
                                    <Form.Control
                                        required
                                        id='text'
                                        className="review_form_text"
                                        as="textarea"
                                        placeholder="Leave a comment here"
                                        style={{ height: '100px' }}
                                        value={textReview}
                                        onChange={event => setTextReview(event.target.value)}
                                    />
                                </FloatingLabel>
                            </Form.Group>
    
                            <Form.Group className="mb-3" controlId="formGridAddress2">
                                <Form.Label id='text'>{t("tags")}</Form.Label>
                                <Tags tags={tags} setTags={setTags}/>
                            </Form.Group>
    
                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="formGridCity">
                                    <Form.Label id='text'>{t("grade")}</Form.Label>
                                    <Form.Select 
                                        required
                                        id='text'
                                        className="grade_form"
                                        defaultValue={t("grade")}
                                        value={authorsAssessment}
                                        onChange={event => setAuthorsAssessment(event.target.value)}
                                    >
                                        <option  value="" elected hidden>{t("grade")}</option>
                                            {number.map(item => 
                                                <option >{item}</option>
                                                )
                                            }
                                        
                                    </Form.Select>
                                </Form.Group>
    
                                <Form.Group as={Col} controlId="formGridState">
                                    <Form.Label id='text'>{t("category")}</Form.Label>
                                    <Form.Select
                                        className="type_form"
                                        id="text"
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
                                            <option value={item.name} key={item.id}>
                                                 {item?.name === "Кино" ? t("common:cinema" ) :
                                                item?.name === "Книги" ? t("common:book") :
                                                item?.name === "Сериалы" ? t("common:series") :
                                                t(item?.name) || item?.name}
                                            </option>
                                        )}
                                    </Form.Select>
                                </Form.Group>
                            </Row>
    
                            <Button 
                                variant="outline-success"
                                type="submit"
                                disabled={!title || !textReview}
                                onClick={() => handleReview('update')}
                            >
                                {t("edit")}
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
                    <Col md={4}  style={{padding: 0}}>
                        {isPictureLoading ? (
                            <Spiner />
                        ) : (
                            <>
                            {picture ? (
                                <Col>
                                <Card className="form_img">
                                    <Card.Img src={picture} />
                                    <MuiFileInput value={file} onChange={(file) => addImg(file)} />
                                </Card>

                                </Col>
                            ) : (
                                <Card.Body >
                                <ListGroup className="list-group-flush form_img">
                                    <ListGroup.Item className="form_img">
                                    <div style={{marginBottom: '8px'}}> {t("uploadImage")} </div>
                                       
                                        <MuiFileInput value={file} onChange={(file) => addImg(file)} />
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
                                    <Form.Label id='text'>{t('title')}</Form.Label>
                                        <Form.Control 
                                            className="form_title"
                                            required
                                            type="text" 
                                            value={title}
                                            onChange={event => setTitle(event.target.value)}
                                        />
                                </Form.Group>
    
                                <Form.Group as={Col} >
                                    <Form.Label id='text'>{t("product")} </Form.Label>
                                    <Product 
                                        data={review?.product}
                                    />
                                </Form.Group>
                            </Row>
    
                            <Form.Group className="mb-3">
                                <FloatingLabel id='text' label={t("review")}>
                                    <Form.Control
                                        id='text'
                                        className="review_form_text"
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
                                <Form.Label id='text'>{t("tags")}</Form.Label>
                                <Tags 
                                    tags={tags} 
                                    setTags={setTags}
                                />
                            </Form.Group>
    
                            <Row className="mb-3">
                                <Form.Group as={Col}>
                                    <Form.Label id='text'>{t("grade")}</Form.Label>
                                    <Form.Select 
                                        required
                                        id='text'
                                        className="grade_form"
                                        defaultValue={t("grade")}
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
                                            <option key={item}>{item}</option>
                                            )
                                        }
                                        
                                    </Form.Select>
                                </Form.Group>
    
                                <Form.Group as={Col}>
                                    <Form.Label id='text'>{t("category")}</Form.Label>
                                    <Form.Select 
                                        required
                                        className="type_form"
                                        id='text'
                                        defaultValue={t("category")}
                                        value={test}
                                        onChange={(e)=> review.setSelectedType(Number(e.target.value))}
                                    >
                                        <option 
                                            value="" 
                                            disabled 
                                            selected 
                                            hidden
                                        >
                                            {''}
                                        </option>
                                        {review?.types?.map(item => 
                                            <option value={item.id} key={item.id}>
                                                {item?.name === "Кино" ? t("common:cinema" ) :
                                                item?.name === "Книги" ? t("common:book") :
                                                item?.name === "Сериалы" ? t("common:series") :
                                                t(item?.name) || item?.name}
                                            </option>   
                                            )
                                        }
                                        
                                    </Form.Select>
                                </Form.Group>
                            </Row>
    
                            <Button 
                                variant="outline-success"
                                type="submit"
                                onClick={() => handleReview('create')}
                                disabled={!title || !textReview}
                            >
                                {t("create")}
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
})