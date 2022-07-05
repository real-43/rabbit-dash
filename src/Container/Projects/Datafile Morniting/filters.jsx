import React, { useState } from 'react';
import { Input } from 'reactstrap';
import Box from '@mui/material/Box';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import './Table.css'

export const Filter = ({ column }) => {
  return (
    <div style={{ marginTop: 5 }}>
      {column.canFilter && column.render('Filter')}
    </div>
  );
};

export const CNUDateColumnFilter = ({
  column: {
    filterValue,
    setFilter,
    preFilteredRows: { length },
  },
}) => {
  return (
    <Input 
      style={{ height: "30px", marginLeft: "auto", marginRight: "auto"}}
      value={filterValue || ''}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
      placeholder={`search...`}
    />
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
      style={{ width: "70px", height: "30px", marginLeft: "auto", marginRight: "auto"}}
      value={filterValue || ''}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
      placeholder={`search...`}
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
      style={{ height: "30px" , fontSize: "13px" }}
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
      return c
    }catch {
      setValue(newValue)
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        label="Date"
        value={value}
        openTo="year"
        views={['year', 'month', 'day']}
        dateFormat={'dd/mm/yyyy'}
        onChange={(newValue) => {
          setFilter(show(newValue) || undefined);
        }}
        renderInput={({ inputRef, inputProps, InputProps }) => (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <input style={{width: "80%"}} ref={inputRef} {...inputProps} onChange={(newValue) => {
              setFilter(show(newValue) || undefined);
            }}/>
            {InputProps?.endAdornment}
          </Box>
        )}
      />
    </LocalizationProvider>
  );
};

export const NoSearch = ({
  column: {
    filterValue,
    setFilter,
    preFilteredRows: { length },
  },
}) => {
  return (
    <Input 
      style={{ width: "30px", height: "30px", marginLeft: "auto", marginRight: "auto"}}
      value={filterValue || ''}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
    />
  );
};