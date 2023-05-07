import React, { useEffect, useState} from 'react';
import { useContext } from 'react';
import { Context } from '..';
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { Service } from '../API/Service';
import { useFetching } from '../hooks/useFetching';

export const Tags = ({tags, setTags}) => {
    const {review} = useContext(Context);

    const [fetchTag, isTagLoading, TagError] = useFetching(async ()=> {
      await Service.getTags().then(data => review.setTags(data));
  })
  const handleChange = (event, value) => {
    review.setSelectedTag(value);
    if (review.selectedTag) {
      setTags(value);
    }
  };

    useEffect(() => {
      fetchTag();
    }, []);

    return(
      <Autocomplete
        className='Nav_Tags'
        key={review.tags.id}
        multiple
        id="tags-outlined"
        options={review.tags}
        getOptionLabel={(option) => option.name}
        filterSelectedOptions
        onChange={handleChange}
        value={tags ? tags : []}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Выбери тег"
            placeholder="Favorites"
          />
        )}
      />
  )
}