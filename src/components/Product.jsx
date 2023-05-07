import React, { useContext, useState, useEffect } from "react"
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { Context } from "..";
import { makeStyles } from '@mui/styles';




export const Product = ({data}) => {
    const {review} = useContext(Context);
    const [selectedProduct, setSelectedProduct] = useState(review.selectedProduct);

    useEffect(() => {
        setSelectedProduct({name: review.selectedProduct});
        console.log(selectedProduct)
    }, [review.selectedProduct]);

    const handleProductSelect = (event, value) => {
        if(value) {
            review.setSelectedProduct(value.name)
        } 
    };
   
    const useStyles = makeStyles({
        autocomplete: {
        },
        input: {
            height: '5px !important',
            zIndex: 2
        },
        label: {
            marginTop: '-5px !important',
            fontSize: '14px !important',

        },
        labelShrink: {
            color: 'blue'
        }
        
    });
    const classes = useStyles();

    return (
        <Autocomplete
          freeSolo
          classes={{root: classes.autocomplete}}
        
          style={{borderRadius: 5, }}
          options={data}
          getOptionLabel={(item) => item.name}
          renderInput={(params) => 
            <TextField 
              {...params} 
              label='Произведение' 
              onChange={(e) => review.setSelectedProduct(e.target.value)}
              InputProps={{
                ...params.InputProps,
                classes: {
                  ...params.InputProps.classes,
                  input: classes.input,
                },
              }}
              InputLabelProps={{
                classes: {
                    ...params.InputProps.classes,
                    root: classes.label,
                    shrink: classes.labelShrink,
                }
              }}
            />
          }
          onChange={handleProductSelect}
          value={selectedProduct}
        />
      );
}
