import React, {useContext, useEffect, useState} from 'react';
import Table from 'react-bootstrap/Table';
import {Container, FormCheck, ButtonToolbar, ButtonGroup, Button} from "react-bootstrap"
import { reaction } from 'mobx';
import { observer } from 'mobx-react-lite';
import { Service } from '../API/Service';
import { Context } from '..';
import { useNavigate } from 'react-router-dom';
import { REVIEW_ROUTE } from '../utils/consts';
import { IoTrashOutline } from "react-icons/io5";
import { TbHeart } from "react-icons/tb";
import { TbCalendar } from "react-icons/tb";
import { TbArrowsDownUp } from "react-icons/tb";
import { TbClipboardList } from "react-icons/tb";
import { TbPencilPlus } from "react-icons/tb";




export const ReviewTable = observer(({myReviews, setMyReviews, fetchRewiewId}) => {
    const {review} = useContext(Context);
    const navigate = useNavigate()
    const[checkAll, setCheckAll] = useState(false);
    const [sortDirectionLike, setSortDirectionLike] = useState("desc");
    const [sortDirectionDate, setSortDirectionDate] = useState("desc");
    const [sortDirectionType, setSortDirectionType] = useState("desc");


    const handleSelectAllChange = () => {
        if (checkAll) {
            setCheckAll(false)
            myReviews?.reviews.forEach((item) => {
                item.selected = false
            });
        } else {
            setCheckAll(true)
            myReviews?.reviews.forEach((item) => {
                item.selected = true
            });
        }
        console.log(myReviews)
    };
    
    const handleSelectChange = (event, item) => {
        item.selected = !item.selected;
        setMyReviews({ ...myReviews });
        console.log(item);
    }

    const deleteReview = async (id) => {
        await Service.deleteReview(id);
            
    };

    const removeReview = async () => {
        const selectedReviews = myReviews?.reviews.filter((item) => item.selected);
        const deletedUserIds = [];
        for (const review of selectedReviews) {
          try {
            await deleteReview(review.id);
            setCheckAll(false)
            deletedUserIds.push(review.id);

          } catch (error) {
            console.log(error);
          }
        }
        const updatedUsers = myReviews?.reviews.filter((user) => !deletedUserIds.includes(user.id));
        setMyReviews({reviews: updatedUsers});
    }

    function sortData() {
        const sortedReviews = myReviews?.reviews.sort((a, b) => {
            if (sortDirectionDate === "desc") {
                return new Date(b.createReview) - new Date(a.createReview);
            } else {
                return new Date(a.createReview) - new Date(b.createReview);
            }
        });
        setSortDirectionDate(sortDirectionDate === "desc" ? "asc" : "desc");
        setMyReviews({ reviews: sortedReviews });
    }

    function sordLike() {
        const { reviews } = myReviews;
        const sortedReviews = reviews.slice().sort((a, b) => {
          if (sortDirectionLike === "desc") {
            return b.likeCount - a.likeCount;
          } else {
            return a.likeCount - b.likeCount;
          }
        });
        setSortDirectionLike(sortDirectionLike === "desc" ? "asc" : "desc");
        setMyReviews({ reviews: sortedReviews });
      }
      
    function sortType() {
        const sortedReviews = myReviews?.reviews.sort((a, b) => {
            if(sortDirectionType === 'desc' || a.types[0].name < b.types[0].name) {
                return -1;
            }
            if (sortDirectionType === 'asc' || a.types[0].name < b.types[0].name) {
                return 1;
            }
            return 0;
        });
        setSortDirectionType(sortDirectionType === "desc" ? "asc" : "desc");
        setMyReviews({ reviews: sortedReviews });
    }
 
    useEffect(() => {
        
    }, [myReviews])
    return ( 
        <Container style={{marginTop: '25px'}}>
        <ButtonToolbar className="mb-3" aria-label="Toolbar with Button groups">
        <ButtonGroup className="me-2" aria-label="First group">
            <Button variant="danger" onClick={removeReview}><IoTrashOutline/></Button>{' '}
            <Button variant="secondary" onClick={sortData}><TbCalendar/></Button>{' '}
            <Button variant="secondary" onClick={sordLike}><TbHeart/></Button>{' '}
            <Button variant="secondary" onClick={sortType}><TbArrowsDownUp/></Button>{' '}
        </ButtonGroup>
    </ButtonToolbar>
        <Table striped bordered hover style={{overflowX: 'auto'}}>
            <thead>
                <tr>
                <th>
                    <FormCheck 
                        type="checkbox"  
                        checked={checkAll}
                        onClick={handleSelectAllChange}
                    />
                </th> 
                <th>#</th>
                <th>Название обзора</th>
                <th>Произведения</th>
                <th>Дата</th>
                <th>Лайки</th>
                <th>Котегория</th>

                </tr>
            </thead>
            <tbody>
                {myReviews?.reviews && myReviews?.reviews.map((item, index) =>
                    <tr>
                        <th>
                            <FormCheck 
                                type="checkbox" 
                                checked={item.selected} 
                                onClick={(e) => handleSelectChange(e, item)}
                            />
                        </th> 
                        <td>{index + 1}</td>
                        <td>{item?.title}</td>
                        <td>{item?.products[0]?.name}</td>
                        <td>{item?.createReview}</td>   
                        <td>{item?.likeCount}</td>
                        <td>{item.types ? item?.types[0]?.name : 'Пусто'}</td>
                        <td>
                            <Button 
                                 variant="warning"
                                onClick={() => {
                                    review.setReviewId(item) 
                                    review.setSelectedTag(item?.tags)
                                    review.setSelectedProduct(item?.products[0]?.name)
                                    review.setSelectedType(item?.types[0]?.name)
                                }}
                            >
                                <TbPencilPlus/>
                            </Button>
                        </td>
                        <td>
                            <Button 
                                variant="info"
                                onClick={() => {
                                    navigate(REVIEW_ROUTE + '/' + item.id)
                                }}
                            >
                                <TbClipboardList/>
                            </Button>
                        </td>
                    </tr>
                )}
            </tbody>
        </Table>
        </Container>
    )
})