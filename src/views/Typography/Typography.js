import React, { useEffect, useState } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import { DataGrid } from '@mui/x-data-grid';
import { Grid, Box } from '@mui/material';

// DummyImages
import a9 from '../../assets/img/A9.jpg';
import m10 from '../../assets/img/M10.jpg';
import flickfootball from '../../assets/img/flickfootball.jpg';
import hair from '../../assets/img/hair.jpg';
import stand from '../../assets/img/stand.jpg';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@mui/material';

import { inventoryManagement } from 'services/inventoryManagement.service';
import { setInventoryList } from 'redux/reducers/inventory_management/inventoryManagementSlice';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import AddModalForm from '../AddInventoryModal/AddInventoryModal'; // Adjust the path as necessary
import SwipeableAlert from 'components/Alert/Alert';

const styles = {
  exportButton: {
    backgroundColor: 'white !important',
    color: '#9f39b5 !important',
    marginLeft: '30px !important',
    width: '160px',
    '&:hover': {
      backgroundColor: '#f0f0f0 !important',
    },
  },
  typo: {
    paddingLeft: "25%",
    marginBottom: "40px",
    position: "relative"
  },
  note: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    bottom: "10px",
    color: "#c0c1c2",
    display: "block",
    fontWeight: "400",
    fontSize: "13px",
    lineHeight: "13px",
    left: "0",
    marginLeft: "20px",
    position: "absolute",
    width: "260px"
  },
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  }
};

const useStyles = makeStyles(styles);

export default function TypographyPage() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const inventoryList = useSelector((state) => state.inventoryManagement.inventoryList);
  const [isAddEditMode, setIsAddEditMode] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState(null);

  // Alert State
  const [alertState, setAlertState] = useState({
    open: false,
    state: '',
    message: '',
  });

  const handleAddEditModeChange = () => setIsAddEditMode(!isAddEditMode);

  useEffect(() => {
    if(!isAddEditMode) {
      setSelectedInventory(null);
    }
  }, [isAddEditMode])

  useEffect(() => {
    if (!inventoryList) {
      fetchInventoryList();
    }
  }, [inventoryList]);

  useEffect(() => {
    if(alertState.open) {
      setTimeout(() => {
        handleResetAlertState();
      }, 3000)
    }
  }, [alertState])

  const handleResetAlertState = () => {
    setAlertState({
      open: false,
      state: '',
      message: '',
    })
  }

  const handleAlertMessageSet = (message) => {
    setAlertState({
      open: true,
      state: 'success',
      message: message,
    })
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    handleResetAlertState();
  };

  const fetchInventoryList = async () => {
    try {
      const response = await inventoryManagement.getInventoryList();
      if (response?.length) {
        dispatch(setInventoryList(response));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleEditClick = (params) => {
    setSelectedInventory(params?.row);
    setIsAddEditMode(true);
  };

  const handleDeleteClick = async (params) => {
    try {
      const response = await inventoryManagement.deleteInventoryItem(params?.row);
      if (response?.message.includes('successfully')) {
        handleAlertMessageSet(response?.message);
        fetchInventoryList();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const columns = [
    { field: 'sku', headerName: 'SKU', width: 150 },
    {
      field: 'product_name',
      headerName: 'PRODUCT NAME',
      width: 150,
      editable: true,
    },
    {
      field: 'quantities',
      headerName: 'QUANTITIES',
      width: 150,
      editable: true,
    },
    {
      field: 'location',
      headerName: 'LOCATION',
      type: 'number',
      width: 110,
      editable: true,
    },
    {
      field: 'product_image',
      headerName: 'PRODUCT IMAGE',
      type: 'number',
      width: 200,
      editable: true,
      renderCell: (params) => (
        <img
          src={params.value}
          alt="Product"
          style={{ borderRadius: '4%', width: '80px', height: '80px', padding: '10px 0' }}
        />
      ),
    },
    {
      field: 'action',
      headerName: 'ACTION',
      width: 100,
      renderCell: (params) => (
        <>
          <IconButton
            onClick={() => handleEditClick(params)}
            aria-label="edit"
            size="small"
          >
            <EditIcon fontSize="inherit" />
          </IconButton>
          <IconButton
            onClick={() => handleDeleteClick(params)}
            aria-label="delete"
            size="small"
          >
          <DeleteIcon fontSize="inherit" />
        </IconButton>
        </>
      ),
    },
  ];

  const { open, state, message } = alertState; // Alert Variables

  return (
    <Card>
      <CardHeader color="primary">
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} alignItems="center">
          <Grid item xs={6}>
            <h4 className={classes.cardTitleWhite}>Inventory List</h4>
            <p className={classes.cardCategoryWhite}>
              The Inventory List that all items stocked in our warehouse.
            </p>
          </Grid>
          <Grid item xs={6}>
            <Box display="flex" justifyContent="flex-end" alignItems="center">
              <Button variant="contained" onClick={handleAddEditModeChange} className={classes.exportButton} style={{ width: '180px' }}>Add Item</Button>
            </Box>
          </Grid>
        </Grid>
      </CardHeader>
      <CardBody>
        <DataGrid
          rowHeight={100}
          rows={inventoryList || []}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                // pageSize: 5,
              },
            },
          }}
          // pageSizeOptions={[5]}
          checkboxSelection
          disableRowSelectionOnClick
        />

        <AddModalForm 
          open={isAddEditMode}
          setOpen={handleAddEditModeChange}
          heading="Add Item"
          getList={fetchInventoryList}
          setMessage={handleAlertMessageSet}
          selectedItemForEdit={selectedInventory}
        />
      </CardBody>

      <SwipeableAlert
        open={open}
        handleClose={handleClose}
        severity={state}
        message={message}
      />
    </Card>
  );
}
