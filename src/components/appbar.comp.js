import { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import SettingsIcon from "@mui/icons-material/Settings";
import Backdrop from "@mui/material/Backdrop";
import SettingsCard from "./settings.comp";
import { CheckSettings } from "../helpers/cookies.helper";
import { Typography } from "@mui/material";

const serverData = require("../data/servers.data.json");

function getServerName(serverNumber, dataCenter) {
	let returnString = "";
	serverData[dataCenter].forEach((server) => {
		// console.log(`is ${serverNumber} === ${server.optionValue}`);
		// console.log(parseInt(server.optionValue) === parseInt(serverNumber));
		if (parseInt(server.optionValue) === parseInt(serverNumber)) {
			returnString = server.optionName;
		}
	});
	return returnString;
}

export default function MenuAppBar() {
	// const [anchorEl, setAnchorEl] = useState(null);
	const [cookies, setCookies] = useState(null);
	const [cookiesValid, setCookiesValid] = useState(false);
	const [settingsButton, setSettingsButton] = useState(false);
	const [dataCenter, setDataCenter] = useState();
	const [serverName, setServerName] = useState();

	function handleCloseClick() {
		setSettingsButton(false);
	}
	function handleCardClick(e) {
		e.stopPropagation();
	}

	useEffect(() => {
		setCookies(CheckSettings());
	}, []);

	useEffect(() => {
		if (cookies) {
			setDataCenter(cookies.dataCenter);
			setServerName(getServerName(cookies.server, cookies.dataCenter));
			let allValid = Object.keys(cookies).every((element) => {
				return cookies[element] !== false;
			});
			setCookiesValid(allValid);
		}
	}, [cookies]);

	// const handleMenu = (event) => {
	// 	setAnchorEl(event.currentTarget);
	// };

	// const handleClose = () => {
	// 	setAnchorEl(null);
	// };

	return (
		<Box style={{ flexGrow: "0" }} sx={{ height: "64px", maxHeight: "64px" }}>
			<AppBar position="static">
				<Toolbar>
					<IconButton
						onClick={() => {
							setSettingsButton(true);
						}}
						size="large"
						edge="start"
						color="inherit"
						aria-label="home"
						sx={{ mr: 2 }}
					>
						<SettingsIcon />
					</IconButton>
					{/* <div> */}
					{/* <IconButton
							size="large"
							aria-label="account of current user"
							aria-controls="menu-appbar"
							aria-haspopup="true"
							onClick={handleMenu}
							color="inherit"
						>
							<AccountCircle />
						</IconButton> */}
					{/* <Menu
							id="menu-appbar"
							anchorEl={anchorEl}
							anchorOrigin={{
								vertical: "top",
								horizontal: "right",
							}}
							keepMounted
							transformOrigin={{
								vertical: "top",
								horizontal: "right",
							}}
							open={Boolean(anchorEl)}
							onClose={handleClose}
						>
							<MenuItem onClick={handleClose}>Profile</MenuItem>
							<MenuItem onClick={handleClose}>My account</MenuItem>
						</Menu> */}
					{/* </div> */}
					<Typography style={{ paddingRight: "1em" }}>{dataCenter ? dataCenter : ""}</Typography>
					<Typography>{serverName ? serverName : ""}</Typography>
				</Toolbar>
			</AppBar>
			<Backdrop
				sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
				open={!cookiesValid || settingsButton}
				onClick={handleCloseClick}
			>
				<SettingsCard sx={{ zIndex: (theme) => theme.zIndex.drawer + 2000 }} handleClick={handleCardClick} />
			</Backdrop>
		</Box>
	);
}
