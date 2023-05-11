import React, { useContext, useState, useEffect } from "react"
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { Context } from "..";
import { makeStyles } from '@mui/styles';
import { observer } from "mobx-react-lite";




export const Product = observer(({data}) => {
    const {review} = useContext(Context);
    const [selectedProduct, setSelectedProduct] = useState(review.selectedProduct);

    useEffect(() => {
        setSelectedProduct({name: review.selectedProduct});
    }, [review.selectedProduct,]);

    

    const handleProductSelect = (event, value) => {
        if(value) {
            review.setSelectedProduct(value.name)
        } 
    };
   
    const useStyles = makeStyles({
        autocomplete: {
        },
        input: {
            height: '4px !important',
        },
        label: {
            marginTop: '-5px !important',
            fontSize: '14px !important',

        },
        
    });
    const classes = useStyles();
    const test = [{
        name: ''
    }]

    return (
        <Autocomplete
          freeSolo
          ListboxProps={{ className: "list_autcompl" }}
          classes={{root: classes.autocomplete}}
          style={{borderRadius: 5, }}
          options={data}
          getOptionLabel={(item) => item.name}
          renderInput={(params) => 
            <TextField 
              {...params} 
              onChange={(e) => review.setSelectedProduct(e.target.value)}
              InputProps={{
                ...params.InputProps,
                classes: {
                  ...params.InputProps.classes,
                  input: classes.input,
                },
                className: `${params.InputProps.className} Nav_Tags`
              }}
              InputLabelProps={{
                classes: {
                    ...params.InputProps.classes,
                    root: classes.label,
                    shrink: classes.labelShrink,
                    className:"Nav_Tags"
                },
              }}
            />
          }
          onChange={handleProductSelect}
          value={selectedProduct === null ? test.name : selectedProduct}
        />
      );
})
