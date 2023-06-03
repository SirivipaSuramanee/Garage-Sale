import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { CategoryInterface } from '../../../models/ICategory';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

type props = {
    Data: CategoryInterface[];
    setCategory: (value: CategoryInterface[]) => void;
  };
  

export default function CheckboxesTags({Data,setCategory}:props) {
  return (
    <Autocomplete
      multiple
      id="checkboxes-tags-demo"
      onChange={(_,value)=>{
        setCategory(value);
      }}
      options={Data}
      disableCloseOnSelect
      getOptionLabel={(option) => option.name}
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          <Checkbox
            icon={icon}
            checkedIcon={checkedIcon}
            style={{ marginRight: 8 }}
            checked={selected}
          />
          {option.name}
        </li>
      )}

      renderInput={(params) => (
        <TextField {...params}  placeholder="กรุณาเลือกหมวดหมู่" />
      )}
    />
  );
}
