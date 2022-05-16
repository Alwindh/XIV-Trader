import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import BasicSelect from "./selector.comp";
import { CheckSettings, SetSettings } from "../helpers/cookies.helper";

const serverData = require("../data/servers.data.json");

function getDataCenterOptions() {
	let dataCenterOptions = [];
	Object.keys(serverData).forEach((dataCenter) => {
		let option = {};
		option["optionValue"] = dataCenter;
		option["optionName"] = dataCenter;
		dataCenterOptions.push(option);
	});
	return dataCenterOptions;
}

export default function SettingsCard() {
	const [dataCenter, setDataCenter] = useState("");
	const [dataCenterOptions] = useState(getDataCenterOptions());
	const [server, setServer] = useState("");
	const [allServerOptions] = useState(serverData);
	const [serverOptions, setServerOptions] = useState(null);
	const [allowDataCenterChoice, setAllowDataCenterChoice] = useState(true);
	const [allowServerChoice, setAllowServerChoice] = useState(false);
	const [cookies, setCookies] = useState();

	useEffect(() => {
		let cookies = CheckSettings();
		setCookies(cookies);
	}, []);

	useEffect(() => {
		console.log(allowDataCenterChoice);
	}, [allowDataCenterChoice]);

	useEffect(() => {
		if (dataCenter !== "") {
			setServerOptions(allServerOptions[dataCenter]);
		}
	}, [dataCenter, allServerOptions]);

	useEffect(() => {
		if (serverOptions) {
			setAllowServerChoice(true);
			setAllowDataCenterChoice(true);
		}
	}, [serverOptions]);

	useEffect(() => {
		if (cookies) {
			Object.keys(cookies).every((element) => {
				return cookies[element] !== false;
			});
		}
	}, [cookies]);

	const handleDataChange = (event) => {
		const data = event.target.value;
		setDataCenter(data);
	};

	const handleServerChange = (event) => {
		const data = event.target.value;
		console.log(event);
		setServer(data);
	};

	function saveCookies() {
		SetSettings({ datacenter: dataCenter, server: server });
		window.location.reload();
	}

	return (
		<Box sx={{ minWidth: 275 }}>
			<Card variant="outlined">
				<CardContent>
					<Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
						Settings
					</Typography>
					{/* <Typography variant="h5" component="div">
						Datacenter and server
					</Typography> */}

					<BasicSelect
						options={dataCenterOptions}
						value={dataCenter}
						handleChange={handleDataChange}
						name={"Datacenter"}
						disabled={!allowDataCenterChoice}
					/>

					<BasicSelect
						options={serverOptions}
						value={server}
						handleChange={handleServerChange}
						name={"Server"}
						disabled={!allowServerChoice}
					/>
					{/* <Typography sx={{ mb: 1.5 }} color="text.secondary">
						adjective
					</Typography>
					<Typography variant="body2">
						well meaning and kindly.
						<br />
						{'"a benevolent smile"'}
					</Typography> */}
				</CardContent>
				<CardActions>
					<Button
						disabled={!dataCenter || !server}
						variant="contained"
						color="primary"
						size="small"
						onClick={saveCookies}
					>
						Save settings
					</Button>
				</CardActions>
			</Card>
		</Box>
	);
}
