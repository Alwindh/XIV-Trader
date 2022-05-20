import React, { useState, useEffect } from "react";

import Axios from "axios";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { useInterval } from "../helpers/interval.helper";
import ComponentTopBar from "./compBar.comp";
import { getItemIds, combineMountsData, getDifferenceString } from "../helpers/dataTools.helper";
import { CheckSettings } from "../helpers/cookies.helper";

const loadData = require("../data/mounts.data.json");
const itemIds = getItemIds(loadData);

export default function MountsComp(props) {
	const [tableData, setTableData] = useState();
	const [loading, setLoading] = useState(true);
	const [updateTime, setUpdateTime] = useState();
	const [resetTimer, setResetTimer] = useState(true);
	const [cookies, setCookies] = useState();
	const [dataCenter, setDataCenter] = useState();

	useEffect(() => {
		setLoading(true);
		setCookies(CheckSettings());
	}, []);

	useEffect(() => {
		if (cookies) {
			setDataCenter(cookies.dataCenter);
		}
	}, [cookies]);

	useEffect(() => {
		if (dataCenter) {
			Axios.get("https://universalis.app/api/v2/" + dataCenter + "/" + itemIds).then((response) => {
				let mountsData = combineMountsData(loadData, response.data);
				setTableData(mountsData);
				setUpdateTime(new Date());
				setLoading(false);
			});
		}
	}, [dataCenter]);

	useInterval(() => {
		setResetTimer(!resetTimer);
		Axios.get("https://universalis.app/api/v2/" + dataCenter + "/" + itemIds).then((response) => {
			let mountsData = combineMountsData(loadData, response.data);
			if (JSON.stringify(mountsData) !== JSON.stringify(tableData)) {
				setUpdateTime(new Date());
				setTableData(mountsData);
			}
		});
	}, 60000);

	if (!cookies) {
		return "";
	} else {
		return (
			<Paper style={{ marginTop: "1em" }}>
				<ComponentTopBar
					barName="Mounts"
					updateTime={getDifferenceString(updateTime)}
					resetTimer={resetTimer}
					loading={loading}
				/>

				{!loading && (
					<div className="dataHolder">
						{tableData.map((itemElement) => {
							return (
								<Accordion key={itemElement.itemId}>
									<AccordionSummary
										expandIcon={<ExpandMoreIcon />}
										aria-controls="panel1a-content"
										id="panel1a-header"
									>
										<Typography sx={{ width: "33%", flexShrink: 0 }}>
											{itemElement.itemName}
										</Typography>
										<Typography sx={{ width: "33%", color: "text.secondary" }}>
											{itemElement.undercutFactor.toFixed(2) * 100 + "%"}
										</Typography>
										<Typography sx={{ width: "33%", color: "text.secondary" }}>
											{itemElement.timeSinceUpdate}
										</Typography>
									</AccordionSummary>
									<AccordionDetails>
										{itemElement.mountListings.map((listing) => {
											return (
												<Grid container spacing={2} key={listing.listingId}>
													<Grid item xs={1}>
														{listing.pricePerUnit}
													</Grid>
													<Grid item xs={1}>
														{listing.quantity}
													</Grid>
													<Grid item xs={5}>
														{listing.worldName}
													</Grid>
													<Grid item xs={5}>
														{listing.timeString}
													</Grid>
												</Grid>
											);
										})}
									</AccordionDetails>
								</Accordion>
							);
						})}
					</div>
				)}
			</Paper>
		);
	}
}
