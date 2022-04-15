import React, { useState, useEffect } from "react";
import { useInterval } from "../helpers/interval.helper";
import Axios from "axios";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Grid from "@mui/material/Grid";

import { getItemIds, combineFlippingData } from "../helpers/dataTools.helper";

const loadData = require("../data/flipping.data.json");
const itemIds = getItemIds(loadData);

export default function FlippingComp() {
	const [tableData, setTableData] = useState();
	const [loading, setLoading] = useState(true);
	const [updateTime, setUpdateTime] = useState();
	const [refreshTime, setRefreshTime] = useState();

	useEffect(() => {
		Axios.get("https://universalis.app/api/v2/light/" + itemIds).then((response) => {
			let flippingData = combineFlippingData(loadData, response.data);
			setTableData(flippingData);
			setRefreshTime(new Date().toString());
			setUpdateTime(new Date().toString());
			setLoading(false);
		});
	}, []);

	useEffect(() => {
		console.log(tableData);
		console.log("IT CHANGED?!");
	}, [tableData]); // Only re-run the effect if count changes

	useInterval(() => {
		Axios.get("https://universalis.app/api/v2/light/" + itemIds).then((response) => {
			let refreshFlippingData = combineFlippingData(loadData, response.data);
			console.log(refreshFlippingData !== tableData);
			if (JSON.stringify(refreshFlippingData) !== JSON.stringify(tableData)) {
				setUpdateTime(new Date().toString());
				setTableData(refreshFlippingData);
				console.log("did a thing");
			}
			setRefreshTime(new Date().toString());

			console.log("REFRESHED");
			setLoading(false);
		});
	}, 60000);

	if (!loading) {
		return (
			<Accordion>
				<AccordionSummary>
					Flipping {updateTime} {refreshTime}
				</AccordionSummary>
				<AccordionDetails>
					{tableData.map((itemElement) => {
						if (itemElement.viableListings.length > 0) {
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
											{itemElement.lowestTwinPrice + " Gil"}
										</Typography>
										<Typography sx={{ width: "33%", color: "text.secondary" }}>
											{itemElement.timeSinceUpdate}
										</Typography>
									</AccordionSummary>
									<AccordionDetails>
										{itemElement.viableListings.map((listing) => {
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
						} else {
							return null;
						}
					})}
				</AccordionDetails>
			</Accordion>
		);
	} else {
		return (
			<Accordion disabled={loading}>
				<AccordionSummary>Flipping - loading...</AccordionSummary>
				<AccordionDetails>null</AccordionDetails>
			</Accordion>
		);
	}
}
