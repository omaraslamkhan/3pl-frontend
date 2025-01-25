import React, { useState, useRef, useEffect, useMemo } from "react";
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
import { useSelector, useDispatch } from "react-redux";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Payout from 'components/Payout/Payout';
import { fulfillmentService } from 'services/fulfillment.service';
import { setOrderFulfillment } from 'redux/reducers/fulfillment/fulfillmentSlice';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { jsonData } from '../../helpers/constants';
import { convertCamelSnakeCase } from '../../helpers/constants';

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
      backgroundColor: '#f0f0f0 !important',
    },
  },
};

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
  const orderFulfillment = useSelector((state) => state.fulfillment?.orderFulfillment);
  const [editOrders, setEditOrders] = useState(false);
  const [selectedOption, setSelectedOption] = useState(stores[0]);
  const [filteredOrders, setFilteredOrders] = useState([]);

  const handleSelectedOption = (options) => setSelectedOption(options);
  const handleEditOrdersChange = () => setEditOrders((prev) => !prev);

  useEffect(() => {
    getFetchOrderFulfillment();
  }, []);

  useEffect(() => {
    const _filteredOrders = orderFulfillment?.filter((item) => item?.shop?.gid === selectedOption?.value);
    if(_filteredOrders?.length) {
      setFilteredOrders(_filteredOrders[0].orders);
    }
  }, [orderFulfillment, selectedOption]);

  const getFetchOrderFulfillment = async () => {
    const response = await fulfillmentService.fetchOrderFulfillment();
    dispatch(setOrderFulfillment(response));
  };

  const generateColumns = (orders) => {
    if (orders.length === 0) return [];

    const keys = Object.keys(orders[0]);
    
    return keys.map((key) => {
      if (key === 'customer') {
        return {
          field: key,
          headerName: convertCamelSnakeCase(key),
          width: 160,
          editable: editOrders,
          valueGetter: (params) => {
            return params?.email || '';
          },
          renderCell: (params) => {
            return <span>{params?.row?.customer?.email || ''}</span>;
          },
          renderEditCell: (params) => (
            <TextField
              variant="outlined"
              size="small"
              value={params.row.customer?.email || ''}
              sx={{ textAlign: 'center', '& .MuiOutlinedInput-input': { textAlign: 'center' } }}
              onChange={(event) => {
                const newCustomer = { ...params.row.customer, email: event.target.value };
                params.api.setEditCellValue({ id: params.id, field: params.field, value: newCustomer });
              }}
            />
          ),
        };
      }
      return {
        field: key,
        headerName: convertCamelSnakeCase(key),
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
      }
    });
  };

  const columns = useMemo(() => generateColumns(filteredOrders), [filteredOrders, editOrders]);

  const exportToCsv = () => {
    const csvRows = [];
    const headers = columns.map(col => col.headerName).join(',');
    csvRows.push(headers);

    filteredOrders.forEach(row => {
      const values = columns.map(col => row[col.field]);
      csvRows.push(values.join(','));
    });

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    saveAs(blob, 'Orders.csv');
  };

  const pdfRef = useRef();
  const generatePayout = async () => {
    await pdfRef.current.generatePDF();
  };

  const noRowsHeight = filteredOrders.length === 0 ? 200 : 'auto';

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="primary">
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
              <Grid item xs={userRole?.toLowerCase() === 'admin' ? 4 : 12}>
                <h4 className={classes.cardTitleWhite}>Order Fulfillment</h4>
                <p className={classes.cardCategoryWhite}>
                  The Orders Fulfillment Data.
                </p>
              </Grid>
              {userRole?.toLowerCase() === 'admin' && (
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
                          '& .MuiFormControlLabel-label': { color: 'white' }
                        }}
                      />
                    </FormGroup>

                    <AutoComplete
                      list={stores}
                      selectedOption={selectedOption}
                      handleSelectedOption={handleSelectedOption}
                    />

                    <Payout data={jsonData} ref={pdfRef} />

                    <Button variant="contained" onClick={exportToCsv} className={classes.exportButton}>Export CSV</Button>
                    <Button variant="contained" onClick={generatePayout} className={classes.exportButton} style={{ width: '180px' }}>Generate Payout</Button>
                  </Box>
                </Grid>
              )}
            </Grid>
          </CardHeader>
          <CardBody>
            <ThemeProvider theme={theme}>
              <Box sx={{ height: noRowsHeight, width: '100%' }}>
                <DataGrid
                  getRowId={(row) =>  {
                    return row.orderNumber
                  }}
                  rows={filteredOrders}
                  columns={columns}
                  initialState={{
                    pagination: {
                      paginationModel: {
                        pageSize: 5,
                      },
                    },
                  }}
                  pageSizeOptions={[5]}
                  checkboxSelection
                  disableRowSelectionOnClick
                />
              </Box>
            </ThemeProvider>

            {userRole?.toLowerCase() === 'admin' && (
              <Box display="flex" justifyContent="flex-end" mt={2}>
                <Button variant="contained">Update</Button>
              </Box>
            )}
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
