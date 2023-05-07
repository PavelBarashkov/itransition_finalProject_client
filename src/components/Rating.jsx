import  React, { useState } from 'react';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import { Service } from '../API/Service';


export const BasicRating = ({ value, userId, productId}) => {
    const [ratingValue, setRatingValue] = React.useState(value);
    const [flag, setFlag] = useState(true)

    const selectedRating = async(ratingValue) => {
        await Service.postRating(userId, productId, ratingValue)
    }

    return (
        <Box className='rating' sx={{ '& > legend': { mt: 2 }, }}>
                {flag 
            ? <Rating 
                name="half-rating" 
                value={ratingValue} 
                onChange={(event, newValue) => {
                    setRatingValue(newValue)
                    selectedRating(newValue)
                    setFlag(false)
                }} />
            :
            <Rating 
                name="half-rating" 
                value={ratingValue}
                readOnly
                onChange={(event, newValue) => {
                    setRatingValue(newValue)
                    selectedRating(newValue)
                }} />
            }
            
            <div>{value}</div>
        </Box>
    )
}