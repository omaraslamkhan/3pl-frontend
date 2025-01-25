import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import TextField from "@material-ui/core/TextField";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import { useDispatch, useSelector } from "react-redux";
import avatar from "assets/img/faces/avatar.jpg";
import { authService } from 'services/auth.service';
import { setLoggedInUser } from '../../redux/reducers/auth/authSlice';
import SwipeableAlert from 'components/Alert/Alert';

const styles = {
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
  },
  gridContainer: {
    alignItems: "end !important",
  },
  inputField: {
    width: "100%",
  },
  aboutBusinessContainer: {
    display: "flex",
    flexDirection: "column",
  }
};

const useStyles = makeStyles(styles);

export default function UserProfile() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const loggedInUser = useSelector((state) => state.auth?.loggedInUser);
  
  // Alert State
  const [alertState, setAlertState] = useState({
    open: false,
    state: '',
    message: '',
  });

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    handleResetAlertState();
  };

  const handleResetAlertState = () => {
    setAlertState({
      open: false,
      state: '',
      message: '',
    })
  }

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      city: "",
      country: "",
      postalCode: "",
      aboutBusiness: ""
    }
  });

  useEffect(() => {
    if(alertState.open) {
      setTimeout(() => {
        handleResetAlertState();
      }, 3000)
    }
  }, [alertState])

  useEffect(() => {
    if (loggedInUser) {
      reset({
        email: loggedInUser.email || "",
        firstName: loggedInUser.firstName || "",
        lastName: loggedInUser.lastName || "",
        city: loggedInUser.city || "",
        country: loggedInUser.country || "",
        postalCode: loggedInUser.postalCode || "",
        aboutBusiness: loggedInUser.aboutBusiness || ""
      });
    }
  }, [loggedInUser, reset]);

  const onSubmit = async (data) => {
    try {
      const response = await authService.updateUser(loggedInUser?.id, data); // Adjust the API endpoint as needed
      if(response?.message?.includes('successfully')) {
        setAlertState({
          open: true,
          state: 'success',
          message: 'User Updated Successfully!',
        })
        const res = await authService.getById(loggedInUser?.id);
        if(res?.id) {
          const user = {
            ...loggedInUser,
            email: res?.email,
            firstName: res?.firstName,
            lastName: res?.lastName,
          };
          dispatch(setLoggedInUser(user))
        }
      } else{
        setAlertState({
          open: true,
          state: 'error',
          message: 'SOmething Went Wrong!',
        })
      }
      // Handle success (e.g., show a notification)
    } catch (error) {
      // Handle error (e.g., show an error message)
    }
  };

  const { open, state, message } = alertState; // Alert Variables

  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={8}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Edit Profile</h4>
              <p className={classes.cardCategoryWhite}>Complete your profile</p>
            </CardHeader>
            <CardBody>
              <form onSubmit={handleSubmit(onSubmit)}>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={4}>
                    <Controller
                      name="email"
                      control={control}
                      render={({ field }) => (
                        <CustomInput
                          labelText="Email address"
                          id="email"
                          formControlProps={{
                            fullWidth: true
                          }}
                          inputProps={{
                            disabled: true,
                            ...field
                          }}
                        />
                      )}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <Controller
                      name="firstName"
                      control={control}
                      render={({ field }) => (
                        <CustomInput
                          labelText="First Name"
                          id="firstName"
                          formControlProps={{
                            fullWidth: true
                          }}
                          inputProps={{
                            ...field
                          }}
                        />
                      )}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <Controller
                      name="lastName"
                      control={control}
                      render={({ field }) => (
                        <CustomInput
                          labelText="Last Name"
                          id="lastName"
                          formControlProps={{
                            fullWidth: true
                          }}
                          inputProps={{
                            ...field
                          }}
                        />
                      )}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={4}>
                    <Controller
                      name="postalCode"
                      control={control}
                      render={({ field }) => (
                        <CustomInput
                          labelText="Postal Code"
                          id="postalCode"
                          formControlProps={{
                            fullWidth: true
                          }}
                          inputProps={{
                            ...field
                          }}
                        />
                      )}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <Controller
                      name="city"
                      control={control}
                      render={({ field }) => (
                        <CustomInput
                          labelText="City"
                          id="city"
                          formControlProps={{
                            fullWidth: true
                          }}
                          inputProps={{
                            ...field
                          }}
                        />
                      )}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <Controller
                      name="country"
                      control={control}
                      render={({ field }) => (
                        <CustomInput
                          labelText="Country"
                          id="country"
                          formControlProps={{
                            fullWidth: true
                          }}
                          inputProps={{
                            ...field
                          }}
                        />
                      )}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer spacing={3} className={classes.gridContainer}>
                  <GridItem item xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="Store (disabled)"
                      id="company-disabled"
                      formControlProps={{
                        fullWidth: true
                      }}
                      className={classes.inputField}
                      inputProps={{
                        disabled: true,
                        value: "Your Store" // Static value as an example
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={8} className={classes.aboutBusinessContainer}>
                    <Controller
                      name="aboutBusiness"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Write your business description.."
                          className={classes.inputField}
                          multiline
                          rows={5}
                        />
                      )}
                    />
                  </GridItem>
                </GridContainer>
                <CardFooter>
                  <Button color="primary" type="submit">Update Profile</Button>
                </CardFooter>
              </form>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <Card profile>
            <CardAvatar profile>
              <a href="#pablo" onClick={e => e.preventDefault()}>
                <img src={avatar} alt="..." />
              </a>
            </CardAvatar>
            <CardBody profile>
              <h6 className={classes.cardCategory}>{loggedInUser?.role}</h6>
              <h4 className={classes.cardTitle}>{loggedInUser?.firstName + ' ' +loggedInUser?.lastName}</h4>
              <p className={classes.description}>
                Welcome to your {loggedInUser?.role === 'seller' ? 'Seller' : 'Admin'} profile on 3PL Valley Dashboard!
              </p>
              {/* <Button color="primary" round>
                Follow
              </Button> */}
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>

      <SwipeableAlert
        open={open}
        handleClose={handleClose}
        severity={state}
        message={message}
      />
    </div>
  );
}
