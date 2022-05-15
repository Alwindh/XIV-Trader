import {useState, useEffect} from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import BasicSelect from './selector.comp';


export default function MenuAppBar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [dataCenter, setDataCenter] =  useState("")
  const [dataCenterOptions] = useState([{optionName:'Light',optionValue: 33},{optionName: 'Dark', optionValue : 34}])
  
  useEffect(()=>{
    console.log(dataCenter)
  },[dataCenter])

  const handleDataChange = (event) => {
    console.log(event.target)
    setDataCenter(event.target.value);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="home"
            sx={{ mr: 2 }}
          >
            <HomeIcon />
          </IconButton>
          <BasicSelect options = {dataCenterOptions} value = {dataCenter} handleChange={handleDataChange} name={'Datacenter'} />
          
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>My account</MenuItem>
              </Menu>
            </div>
          
        </Toolbar>
      </AppBar>
    </Box>
  );
}
