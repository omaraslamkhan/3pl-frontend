import React from 'react';
import styles from "assets/jss/material-dashboard-react/components/headerLinksStyle.js";
import { makeStyles } from "@material-ui/core/styles";
import { Autocomplete, TextField } from '@mui/material';

const AutoComplete = ({ list, selectedOption, handleSelectedOption }) => {

    const handleOptionChange = (event, newValue) => {
        handleSelectedOption(newValue);
    };

    return (
        <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={list}
            getOptionLabel={(option) => option.label}
            onChange={handleOptionChange}
            // value={selectedOption ? selectedOption : {}}
            sx={{
                width: 300,
                '& .MuiInputLabel-root': { color: 'white' }, // Label color
                '& .MuiInputBase-root': { color: 'white' }, // Text color
                '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'white' // Border color
                },
                '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'white' // Border color on hover
                },
                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'white' // Border color when focused
                },
                '& .MuiSvgIcon-root': { color: 'white' } // Dropdown icon color
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Select Saler Store To Fetch Orders.."
                    InputLabelProps={{
                        style: { color: 'white' } // Label color when focused
                    }}
                    InputProps={{
                        ...params.InputProps,
                        style: { color: 'white' }, // Text color
                        endAdornment: (
                            <params.InputProps.endAdornment.type {...params.InputProps.endAdornment.props} sx={{ color: 'white' }} />
                        ) // Icon color
                    }}
                />
            )}
        />
    );
}

export default AutoComplete;
