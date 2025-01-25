import React, { useState, useEffect } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import image from "../../assets/img/login.jpeg";
import logo from "../../assets/img/logodark.png";
import { authService } from "../../services/auth.service";
import { fetchApi } from "../../helpers/utils";
import { useSelector, useDispatch } from 'react-redux';
import { setLoggedInUser } from '../../redux/reducers/auth/authSlice';
import CryptoJS from 'crypto-js';
import SwipeableAlert from 'components/Alert/Alert';

const Copyright = () => {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://www.3plvalley.com/">
        3PL VALLEY
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
    backgroundImage: `url(${image})`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[50]
        : theme.palette.grey[900],

    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  size: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  },

  paper: {
    margin: theme.spacing(2, 6),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(0),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

export default function Login(props) {
  const auth = useSelector((state) => state.auth)
  const token = useSelector((state) => state.auth.token);
  if(token) props.history.push("/admin/dashboard");

  // Alert State
  const [alertState, setAlertState] = useState({
    open: false,
    state: '',
    message: '',
  });

  const handleResetAlertState = () => {
    setAlertState({
      open: false,
      state: '',
      message: '',
    })
  }

  useEffect(() => {
    if(alertState.open) {
      setTimeout(() => {
        handleResetAlertState();
      }, 3000)
    }
  }, [alertState])
  
  const classes = useStyles();
  const dispatch = useDispatch();
  const [account, setAccount] = useState({
    email: "admin@3plvalley.com", 
    password: "3plvalley@123!"
  });

  const handelAccount = (property, event) => {
    const accountCopy = { ...account };
    accountCopy[property] = event.target.value;
    setAccount(accountCopy);
  }

  const handelLogin = async () => {
    if (account.email !== '' && account.password !== '') {
      try {
        // Encrypt the password using sha256
        const encryptedPassword = encryptPassword(account.password);
        
        // Create an object with the email and encrypted password
        const loginData = {
          email: account.email,
          password: encryptedPassword
        };

        const loginResponse = await fetchApi(
          'users/authenticate',
          'POST',
          loginData
        );
        if (loginResponse?.user) {
          await setAlertState({
            open: true,
            state: 'success',
            message: 'You are Logged in Successfully!',
          })
          await dispatch(setLoggedInUser(loginResponse?.user));
          props.history.push("admin/dashboard");
        } else {
          setAlertState({
            open: true,
            state: 'error',
            message: 'Username or Password not matched or Server not responding!',
          })
        }
      } catch (error) {
        return error;
      }
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    handleResetAlertState();
  };

  // Secret key for AES encryption
  const secretKey = '3pl678'; 

  // Function to encrypt the password using AES
  function encryptPassword(password) {
    return CryptoJS.AES.encrypt(password, secretKey).toString();
  }

  const { open, state, message } = alertState; // Alert Variables

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid
        className={classes.size}
        item
        xs={12}
        sm={8}
        md={4}
        component={Paper}
        elevation={1}
        square
      >
        <div className={classes.paper}>
          <img src={logo} alt="logo" style={{width: '60px', height: '60px'}} />
          <form className={classes.form} noValidate>
            <TextField
              onChange={(event) => handelAccount("email", event)}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoFocus
            />
            <TextField
              onChange={(event) => handelAccount("password", event)}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={handelLogin}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
            <Box mt={5}>
              <Copyright />
            </Box>
          </form>
        </div>
      </Grid>

      <SwipeableAlert
        open={open}
        handleClose={handleClose}
        severity={state}
        message={message}
      />
    </Grid>
  );
}
