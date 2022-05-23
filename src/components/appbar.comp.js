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
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import Button from "@mui/material/Button";

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
	const [cutoffPrice, setCutoffPrice] = useState();

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
			setCutoffPrice(cookies.price);
			let allValid = Object.keys(cookies).every((element) => {
				return cookies[element] !== false;
			});
			setCookiesValid(allValid);
		}
	}, [cookies]);

	return (
		<Box style={{ flexGrow: "0" }} sx={{ height: "64px", maxHeight: "64px" }}>
			<AppBar position="static">
				<Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
					<Toolbar>
						<CurrencyExchangeIcon />
						<Typography variant="h5" style={{ paddingLeft: "2em" }}>
							XIV Trader
						</Typography>
					</Toolbar>
					<Toolbar
						onClick={() => {
							setSettingsButton(true);
						}}
					>
						<Button style={{ marginRight: "2em" }}>
							<Typography style={{ color: "#fff" }}>{dataCenter ? dataCenter : ""}</Typography>
						</Button>
						<Button style={{ marginRight: "2em" }}>
							<Typography style={{ color: "#fff" }}>{serverName ? serverName : ""}</Typography>
						</Button>
						<Button style={{ marginRight: "2em" }}>
							<Typography style={{ color: "#fff" }}>
								{cutoffPrice ? "> " + cutoffPrice + " gil" : ""}
							</Typography>
						</Button>
						<IconButton size="large" edge="start" color="inherit" aria-label="home">
							<SettingsIcon />
						</IconButton>
					</Toolbar>
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
