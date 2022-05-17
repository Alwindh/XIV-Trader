import { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import SettingsIcon from "@mui/icons-material/Settings";
import Modal from "@mui/material/Modal";
import SettingsCard from "./settings.comp";
import { CheckSettings } from "../helpers/cookies.helper";
import { Typography } from "@mui/material";

const serverData = require("../data/servers.data.json");

function getServerName(serverNumber, dataCenter) {
	let returnString = "";
	serverData[dataCenter].forEach((server) => {
		if (parseInt(server.optionValue) === parseInt(serverNumber)) {
			returnString = server.optionName;
		}
	});
	return returnString;
}

export default function MenuAppBar() {
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
					<Typography style={{ paddingRight: "1em" }}>{dataCenter ? dataCenter : ""}</Typography>
					<Typography>{serverName ? serverName : ""}</Typography>
				</Toolbar>
			</AppBar>
			<Modal
				sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
				open={!cookiesValid || settingsButton}
				onClose={handleCloseClick}
			>
				<SettingsCard sx={{ zIndex: (theme) => theme.zIndex.drawer + 2000 }} handleClick={handleCardClick} />
			</Modal>
		</Box>
	);
}
