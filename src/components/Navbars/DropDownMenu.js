import React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import styles from "assets/jss/material-dashboard-react/components/headerLinksStyle.js";
import { makeStyles } from "@material-ui/core/styles";
import Person from "@material-ui/icons/Person";
import Hidden from "@material-ui/core/Hidden";
import Button from "components/CustomButtons/Button.js";
import { useHistory } from 'react-router-dom';
import { setLoggedOut } from '../../redux/reducers/auth/authSlice';
import { useDispatch } from 'react-redux';

const useStyles = makeStyles(styles);

const DropDownMenu = () => {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClose = () => setAnchorEl(null);
    const handleClick = (event) => setAnchorEl(event.currentTarget);

    const handleLogout = () => {
        dispatch(setLoggedOut());
    }

    return <div>
        <Button
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            color={window.innerWidth > 959 ? "transparent" : "white"}
            justIcon={window.innerWidth > 959}
            simple={!(window.innerWidth > 959)}
            aria-owns="profile-menu-list-grow"
            className={classes.buttonLink}
        >
            <Person className={classes.icons} />
            <Hidden mdUp implementation="css">
                <p className={classes.linkText}>Profile</p>
            </Hidden>
        </Button>
        <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
                'aria-labelledby': 'basic-button',
            }}
        >
        <MenuItem onClick={() => history.push('/admin/user')}>My Profile</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
    </div>
}

export default DropDownMenu;