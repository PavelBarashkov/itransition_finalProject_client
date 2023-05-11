    import React, { useEffect, useState} from 'react';
    import { useContext } from 'react';
    import { Context } from '..';
    import Chip from '@mui/material/Chip';
    import Autocomplete from '@mui/material/Autocomplete';
    import TextField from '@mui/material/TextField';
    import Stack from '@mui/material/Stack';
    import { Service } from '../API/Service';
    import { useFetching } from '../hooks/useFetching';
    import { useTranslation } from "react-i18next";
    import { makeStyles } from '@mui/styles';

    export const Tags = ({tags, setTags}) => {
        const {review} = useContext(Context);
        const {t} = useTranslation(["common", "home"])

        const [fetchTag, isTagLoading, TagError] = useFetching(async ()=> {
        await Service.getTags().then(data => review.setTags(data));
    })
    const handleChange = (event, value) => {
        review.setSelectedTag(value);
        if (review.selectedTag) {
            setTags(value);
        }
    };
    const getTagLabel = (tag) => {
        switch (tag) {
          case "Новые":
            return t("common:new");
          case "Старые":
            return t("common:old");
          case "Крутые":
            return t("common:nice");
          case "Любимые":
            return t("common:favorite");
          default:
            return t(tag);
        }
      };

    const handleInputChange = (event, value) => {
        review.setSelectedTag(value.split(' ').map(tag => ({name: tag})));

      };
 
    const useStyles = makeStyles({
        autocomplete: {
        },
        input: {
            // color: "white !important"
        },
        label: {
            
        },
        
        });
        const classes = useStyles();

        useEffect(() => {
        fetchTag();
        }, []);

      

        return(
        <Autocomplete
        freeSolo
        ListboxProps={{ className: "list_autcompl" }}
        style={{marginBottom: '40px'}}
        className='Nav_Tags'
        key={review.tags.id}
        classes={{
            root: classes.autocomplete,
        }}
        multiple
        id="tags-outlined"
        options={review.tags}
        getOptionLabel={(option) => getTagLabel(option.name)
        }
        filterSelectedOptions
        onChange={handleChange}
        value={tags ? tags : []}
        onInputChange={handleInputChange}
        renderInput={(params) => (
        <TextField
            {...params}
            placeholder={t("home:tags")}
            InputProps={{
                ...params.InputProps,
            
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
        
        )}
        renderTags={(value, getTagProps) =>
            value.map((option, index) => (
                
                <Chip
                label={getTagLabel(option.name)}
                    {...getTagProps({ index })}
                    className='tag_form'
                    classes={{
                        root: classes.chip
                    }}
                    
                />
            ))
        }
    />
    )
    }