import * as React from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { CategoryInterface } from '../../models/ICategory';
type Dataprops = {
  Data: CategoryInterface;
};
export default function CheckboxLabels({Data}: Dataprops) {
  return (
    <>
      <FormControlLabel key={Data.ID} control={<Checkbox defaultChecked />} label={Data.name} />
    </>
   
  );
}