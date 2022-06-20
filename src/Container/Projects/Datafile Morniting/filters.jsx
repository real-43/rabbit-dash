import React, { useState } from 'react';
import { Button, Input } from 'reactstrap';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import enLocale from 'date-fns/locale/en-US';

export const Filter = ({ column }) => {
  return (
    <div style={{ marginTop: 5 }}>
      {column.canFilter && column.render('Filter')}
    </div>
  );
};

export const DefaultColumnFilter = ({
  column: {
    filterValue,
    setFilter,
    preFilteredRows: { length },
  },
}) => {
  return (
    <Input
      value={filterValue || ''}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
      placeholder={`search (${length}) ...`}
    />
  );
};

export const SelectColumnFilter = ({
  column: { filterValue, setFilter, preFilteredRows, id },
}) => {
  const options = React.useMemo(() => {
    const options = new Set();
    preFilteredRows.forEach((row) => {
      options.add(row.values[id]);
    });
    return [...options.values()];
  }, [id, preFilteredRows]);

  return (
    <Input
      id='custom-select'
      type='select'
      value={filterValue}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
    >
      <option value=''>All</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </Input>
  );
};

export const DateColumnFilter = ({
  column: { filterValue, setFilter },
}) => {
  const [value, setValue] = useState(null);
  const show = (newValue) => {
    try{
      setValue(newValue)
      let d = JSON.stringify(newValue)
      let a = d.split("T")
      let b = a[0].split("-")
      let c = b[2] + "/"+ b[1] + "/" +b[0].split("\"")[1]
      console.log("first", c, typeof(c))
      return c
    }catch {
      setValue(newValue)
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Button onClick={(e) => {setFilter(undefined)}}>1</Button>
      <DatePicker
        label="Date"
        value={""}
        openTo="year"
        views={['year', 'month', 'day']}
        onChange={(newValue) => {
          setFilter(show(newValue) || undefined);
          console.log("Filter", filterValue, typeof(filterValue))
        }}
        renderInput={(params) => <TextField {...params} onChange={(newValue) => {
          setFilter(show(newValue) || undefined);
          console.log("Filter", filterValue, typeof(filterValue))
        }}/>}
      />
    </LocalizationProvider>
  );
};