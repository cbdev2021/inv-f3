import React, { FunctionComponent } from 'react';
import { AppBar, Toolbar, IconButton, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';

interface HeaderProps {
    onMenuClick: () => void;
}

const Header: FunctionComponent<HeaderProps> = ({ onMenuClick }) => {
    const { userInfo } = useSelector((state: any) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [logoutApi, { isLoading: isLoggingOut }] = useLogoutMutation();


    const handleLogout = async () => {
        try {
            await logoutApi;
            dispatch(logout());
            navigate('/login');
        } catch (err) {
            console.error(err);
            console.error('Error al cerrar sesión:', err);
        }
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <IconButton edge="start" color="inherit" aria-label="menu" onClick={onMenuClick}>
                    <MenuIcon />
                </IconButton>
                {/* <Typography variant="h6" component="div">
                    Inv
                </Typography> */}

                <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontFamily: 'Exo 2, sans-serif', fontSize: '1.8rem', fontWeight: 600, letterSpacing: '2px' }}>
                    Inv
                </Typography>

                <div style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
                    <SearchIcon />
                    <InputBase placeholder="Search..." sx={{ marginLeft: '5px', color: '#fff' }} />
                </div>
                <Link to="/profile" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <IconButton color="inherit">
                        <AccountCircleIcon />
                    </IconButton>
                </Link>
                <IconButton color="inherit" onClick={handleLogout}>
                    <LogoutIcon />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
};

export default Header;


