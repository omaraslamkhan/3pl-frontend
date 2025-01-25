import React, { useState, useRef, useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import { DataGrid } from '@mui/x-data-grid';
import AutoComplete from '../../components/AutoComplete/AutoComplete';
import { Grid, Box, Button, TextField } from '@mui/material';
import { useSelector } from "react-redux";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Payout from 'components/Payout/Payout';
import { fulfillmentService } from 'services/fulfillment.service'; 
import { setOrderFulfillment } from 'redux/reducers/fulfillment/fulfillmentSlice'; 
import { useDispatch } from 'react-redux';

// CSV Imports
import { saveAs } from 'file-saver';

// Import PDF for Payout
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

// constants
import { jsonData } from '../../helpers/constants';

const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0"
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF"
    }
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1"
    }
  },
  exportButton: {
    backgroundColor: 'white !important',
    color: '#9f39b5 !important',
    marginLeft: '30px !important',
    width: '160px',
    '&:hover': {
      backgroundColor: '#f0f0f0 !important', // Light grey background on hover
    },
  },
};

const rows = [
  {
    id: 1,
    order: 1001,
    order_ref: 'A001',
    order_date: '2023-01-01',
    customer: 'Jon Snow',
    qty_ordered_pcs: 10,
    total_amount: 100.0,
    contact: 'jon.snow@example.com',
    carrier: 'UPS',
    tracking: '1Z999AA10123456784',
    status: 'Delivered',
    shipment_status: 'Completed',
    seller_order_status: 'Confirmed',
    seller_order_reason: 'Customer Requested',
  },
  {
    id: 2,
    order: 1002,
    order_ref: 'A002',
    order_date: '2023-01-02',
    customer: 'Cersei Lannister',
    qty_ordered_pcs: 5,
    total_amount: 50.0,
    contact: 'cersei.lannister@example.com',
    carrier: 'FedEx',
    tracking: '123456789012',
    status: 'In Transit',
    shipment_status: 'Shipped',
    seller_order_status: 'Processing',
    seller_order_reason: 'Out of Stock',
  },
  {
    id: 3,
    order: 1003,
    order_ref: 'A003',
    order_date: '2023-01-03',
    customer: 'Jaime Lannister',
    qty_ordered_pcs: 15,
    total_amount: 150.0,
    contact: 'jaime.lannister@example.com',
    carrier: 'DHL',
    tracking: 'JD000123456789',
    status: 'Pending',
    shipment_status: 'Pending',
    seller_order_status: 'Pending',
    seller_order_reason: 'New Order',
  },
  {
    id: 4,
    order: 1004,
    order_ref: 'A004',
    order_date: '2023-01-04',
    customer: 'Arya Stark',
    qty_ordered_pcs: 20,
    total_amount: 200.0,
    contact: 'arya.stark@example.com',
    carrier: 'USPS',
    tracking: '9400111899560600000000',
    status: 'Delivered',
    shipment_status: 'Completed',
    seller_order_status: 'Confirmed',
    seller_order_reason: 'Customer Requested',
  },
  {
    id: 5,
    order: 1005,
    order_ref: 'A005',
    order_date: '2023-01-05',
    customer: 'Daenerys Targaryen',
    qty_ordered_pcs: 12,
    total_amount: 120.0,
    contact: 'daenerys.targaryen@example.com',
    carrier: 'UPS',
    tracking: '1Z999AA10123456785',
    status: 'Delivered',
    shipment_status: 'Completed',
    seller_order_status: 'Confirmed',
    seller_order_reason: 'Customer Requested',
  },
  {
    id: 6,
    order: 1006,
    order_ref: 'A006',
    order_date: '2023-01-06',
    customer: 'Melisandre',
    qty_ordered_pcs: 7,
    total_amount: 70.0,
    contact: 'melisandre@example.com',
    carrier: 'FedEx',
    tracking: '123456789013',
    status: 'In Transit',
    shipment_status: 'Shipped',
    seller_order_status: 'Processing',
    seller_order_reason: 'Out of Stock',
  },
  {
    id: 7,
    order: 1007,
    order_ref: 'A007',
    order_date: '2023-01-07',
    customer: 'Ferrara Clifford',
    qty_ordered_pcs: 18,
    total_amount: 180.0,
    contact: 'ferrara.clifford@example.com',
    carrier: 'DHL',
    tracking: 'JD000123456790',
    status: 'Pending',
    shipment_status: 'Pending',
    seller_order_status: 'Pending',
    seller_order_reason: 'New Order',
  },
  {
    id: 8,
    order: 1008,
    order_ref: 'A008',
    order_date: '2023-01-08',
    customer: 'Rossini Frances',
    qty_ordered_pcs: 25,
    total_amount: 250.0,
    contact: 'rossini.frances@example.com',
    carrier: 'USPS',
    tracking: '9400111899560600000001',
    status: 'Delivered',
    shipment_status: 'Completed',
    seller_order_status: 'Confirmed',
    seller_order_reason: 'Customer Requested',
  },
  {
    id: 9,
    order: 1009,
    order_ref: 'A009',
    order_date: '2023-01-09',
    customer: 'Harvey Roxie',
    qty_ordered_pcs: 30,
    total_amount: 300.0,
    contact: 'harvey.roxie@example.com',
    carrier: 'UPS',
    tracking: '1Z999AA10123456786',
    status: 'Delivered',
    shipment_status: 'Completed',
    seller_order_status: 'Confirmed',
    seller_order_reason: 'Customer Requested',
  },
];

const theme = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          justifyContent: 'center',
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#9a33b1',
            },
            '&:hover fieldset': {
              borderColor: '#9a33b1',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#9a33b1',
            },
          },
        },
      },
    },
  },
});

const useStyles = makeStyles(styles);

export default function TableList() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const userRole = useSelector((state) => state.auth?.loggedInUser?.role);
  const stores = useSelector((state) => state.fulfillment?.stores);
  const [editOrders, setEditOrders] = useState(false);
  const handleEditOrdersChange = () => setEditOrders((prev) => !prev);

  useEffect(() => {
    getFetchOrderFulfillment();
  }, [])

  const getFetchOrderFulfillment = async () => {
    const response = await fulfillmentService.fetchOrderFulfillment();
    dispatch(setOrderFulfillment(response));
  }

  const columns = [
      { field: 'id', headerName: 'ID', width: 90 },
      {
        field: 'order',
        headerName: 'Order #',
        width: 150,
      },
      {
        field: 'order_date',
        headerName: 'Order Date',
        type: 'number',
        width: 110,
      },
      {
        field: 'customer',
        headerName: 'Customer',
        description: 'This column has a value getter and is not sortable.',
        sortable: false,
        width: 160,
        editable: editOrders,
        renderEditCell: (params) => (
          <TextField
            variant="outlined"
            size="small"
            value={params.value}
            sx={{ textAlign: 'center', '& .MuiOutlinedInput-input': { textAlign: 'center' } }}
            onChange={(event) => {
              params.api.setEditCellValue({ id: params.id, field: params.field, value: event.target.value });
            }}
          />
        ),
      },
      {
        field: 'qty_ordered_pcs',
        headerName: 'QTY Ordered PCs',
        description: 'This column has a value getter and is not sortable.',
        sortable: false,
        width: 160,
        editable: editOrders,
        renderEditCell: (params) => (
          <TextField
            variant="outlined"
            size="small"
            value={params.value}
            sx={{ textAlign: 'center', '& .MuiOutlinedInput-input': { textAlign: 'center' } }}
            onChange={(event) => {
              params.api.setEditCellValue({ id: params.id, field: params.field, value: event.target.value });
            }}
          />
        ),
      },
      {
        field: 'total_amount',
        headerName: 'Total Amount',
        description: 'This column has a value getter and is not sortable.',
        sortable: false,
        width: 160,
        editable: editOrders,
        renderEditCell: (params) => (
          <TextField
            variant="outlined"
            size="small"
            value={params.value}
            sx={{ textAlign: 'center', '& .MuiOutlinedInput-input': { textAlign: 'center' } }}
            onChange={(event) => {
              params.api.setEditCellValue({ id: params.id, field: params.field, value: event.target.value });
            }}
          />
        ),
      },
      {
        field: 'contact',
        headerName: 'Contact',
        description: 'This column has a value getter and is not sortable.',
        sortable: false,
        width: 160,
        editable: editOrders,
        renderEditCell: (params) => (
          <TextField
            variant="outlined"
            size="small"
            value={params.value}
            sx={{ textAlign: 'center', '& .MuiOutlinedInput-input': { textAlign: 'center' } }}
            onChange={(event) => {
              params.api.setEditCellValue({ id: params.id, field: params.field, value: event.target.value });
            }}
          />
        ),
      },
      {
        field: 'carrier',
        headerName: 'Carrier',
        description: 'This column has a value getter and is not sortable.',
        sortable: false,
        width: 160,
        editable: editOrders,
        renderEditCell: (params) => (
          <TextField
            variant="outlined"
            size="small"
            value={params.value}
            sx={{ textAlign: 'center', '& .MuiOutlinedInput-input': { textAlign: 'center' } }}
            onChange={(event) => {
              params.api.setEditCellValue({ id: params.id, field: params.field, value: event.target.value });
            }}
          />
        ),
      },
      {
        field: 'tracking',
        headerName: 'Tracking Id',
        description: 'This column has a value getter and is not sortable.',
        sortable: false,
        width: 160,
        editable: editOrders,
        renderEditCell: (params) => (
          <TextField
            variant="outlined"
            size="small"
            value={params.value}
            sx={{ textAlign: 'center', '& .MuiOutlinedInput-input': { textAlign: 'center' } }}
            onChange={(event) => {
              params.api.setEditCellValue({ id: params.id, field: params.field, value: event.target.value });
            }}
          />
        ),
      },
      {
        field: 'status',
        headerName: 'Status',
        description: 'This column has a value getter and is not sortable.',
        sortable: false,
        width: 160,
        editable: editOrders,
        renderEditCell: (params) => (
          <TextField
            variant="outlined"
            size="small"
            value={params.value}
            sx={{ textAlign: 'center', '& .MuiOutlinedInput-input': { textAlign: 'center' } }}
            onChange={(event) => {
              params.api.setEditCellValue({ id: params.id, field: params.field, value: event.target.value });
            }}
          />
        ),
      },
      {
        field: 'shipment_status',
        headerName: 'Shipment Status',
        description: 'This column has a value getter and is not sortable.',
        sortable: false,
        width: 160,
        editable: editOrders,
        renderEditCell: (params) => (
          <TextField
            variant="outlined"
            size="small"
            value={params.value}
            sx={{ textAlign: 'center', '& .MuiOutlinedInput-input': { textAlign: 'center' } }}
            onChange={(event) => {
              params.api.setEditCellValue({ id: params.id, field: params.field, value: event.target.value });
            }}
          />
        ),
      },
      {
        field: 'seller_order_status',
        headerName: 'Seller Order Status',
        description: 'This column has a value getter and is not sortable.',
        sortable: false,
        width: 160,
        editable: editOrders,
        renderEditCell: (params) => (
          <TextField
            variant="outlined"
            size="small"
            value={params.value}
            sx={{ textAlign: 'center', '& .MuiOutlinedInput-input': { textAlign: 'center' } }}
            onChange={(event) => {
              params.api.setEditCellValue({ id: params.id, field: params.field, value: event.target.value });
            }}
          />
        ),
      },
      // {
      //   field: 'seller_order_reason',
      //   headerName: 'Seller Order Reason',
      //   description: 'This column has a value getter and is not sortable.',
      //   sortable: false,
      //   width: 160,
      //   editable: editOrders,
      //   renderEditCell: (params) => (
      //     <TextField
      //       variant="outlined"
      //       size="small"
      //       value={params.value}
      //       sx={{ textAlign: 'center', '& .MuiOutlinedInput-input': { textAlign: 'center' } }}
      //       onChange={(event) => {
      //         params.api.setEditCellValue({ id: params.id, field: params.field, value: event.target.value });
      //       }}
      //     />
      //   ),
      // },
  ];

  const exportToCsv = () => {
    debugger
    const csvRows = [];
    const headers = columns.map(col => col.headerName).join(',');
    csvRows.push(headers);
  
    rows.forEach(row => {
      const values = columns.map(col => row[col.field]);
      csvRows.push(values.join(','));
    });
  
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    saveAs(blob, 'Orders.csv');
  };

  const pdfRef = useRef();
  const genaratePayout = async () => {
    await pdfRef.current.generatePDF();
  }

  console.log('stores', stores)
  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="primary">

          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item xs={ userRole?.toLowerCase() === 'admin' ? 4 : 12 }>
              <h4 className={classes.cardTitleWhite}>Order Fulfillment</h4>
              <p className={classes.cardCategoryWhite}>
                The Orders Fulfillment Data.
              </p>
            </Grid>
            {userRole?.toLowerCase() === 'admin' &&
              <Grid item xs={8}>
                <Box display="flex" justifyContent="flex-end" alignItems="center">
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={editOrders}
                          onChange={handleEditOrdersChange}
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                              color: 'white',
                              '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                              },
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                              backgroundColor: 'white',
                            },
                          }}
                        />
                      }
                      label="Edit Orders"
                      sx={{
                        '& .MuiFormControlLabel-label': { color: 'white' } // Label color
                      }}
                    />
                  </FormGroup>
                  
                  <AutoComplete list={stores} />

                  <Payout data={jsonData} ref={pdfRef} />
                  
                  <Button variant="contained" onClick={exportToCsv} className={classes.exportButton} >Export CSV</Button>
                  <Button variant="contained" onClick={genaratePayout} className={classes.exportButton} style={{width: '180px'}} >Generate Payout</Button>
                </Box>
              </Grid>
            }
          </Grid>
          </CardHeader>
          <CardBody>
            {/* <div style={{ height: 600, width: '100%' }}> */}
            <ThemeProvider theme={theme}>
              <DataGrid
                rows={rows}
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
            </ThemeProvider>
            {/* </div> */}

            {userRole?.toLowerCase() === 'admin' &&
              <Box display="flex" justifyContent="flex-end" mt={2}>
                <Button variant="contained">Submit</Button>
              </Box>
            }
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
