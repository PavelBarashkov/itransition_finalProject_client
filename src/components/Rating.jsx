import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import { Service } from '../API/Service';

export const BasicRating = ({ value, userId, productId, localId, fetchReview}) => {
    const [ratingValue, setRatingValue] = useState(value);
    const [flag, setFlag] = useState(true);

    const selectedRating = async (ratingValue) => {
        await Service.postRating(userId, productId, ratingValue).then(response => {
            console.log(response.data);
            setRatingValue(response.data.averageRating)
            fetchReview()
        });
    };

    const handleChange = (event, newValue) => {
        setRatingValue(newValue);
        selectedRating(newValue);
        setFlag(false);
        forceUpdate();
    };    

    useEffect(() => {
    },[ratingValue])

    const forceUpdate = () => {
        setFlag(!flag);
    }

    return (
        <Box className='rating' sx={{ '& > legend': { mt: 2 } }}>
        {localId ? (
            flag ? (
            <Rating name='half-rating' value={ratingValue} onChange={handleChange} />
            ) : (
            <Rating name='half-rating' value={ratingValue} readOnly onChange={handleChange} />
            )
        ) : (
            <Rating name='half-rating' value={ratingValue} readOnly onChange={handleChange} />
        )}
        <div>{value}</div>
        </Box>
    );
};
