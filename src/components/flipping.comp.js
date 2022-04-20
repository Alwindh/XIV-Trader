import React, { useState, useEffect } from "react";
import { useInterval } from "../helpers/interval.helper";
import Axios from "axios";
import Paper from "@mui/material/Paper";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

import { getItemIds, combineFlippingData, getDifferenceString } from "../helpers/dataTools.helper";
import ComponentTopBar from "./compBar.comp";

const loadData = require("../data/flipping.data.json");
const itemIds = getItemIds(loadData);

export default function FlippingComp() {
	const [tableData, setTableData] = useState();
	const [loading, setLoading] = useState(true);
	const [updateTime, setUpdateTime] = useState();
	const [progress, setProgress] = useState(0);
	const [resetTimer, setResetTimer] = useState(true);

	useEffect(() => {
		setLoading(true);
		setProgress(0);
		Axios.get("https://universalis.app/api/v2/light/" + itemIds).then((response) => {
			let flippingData = combineFlippingData(loadData, response.data);
			setTableData(flippingData);
			setUpdateTime(new Date());
			setLoading(false);
		});
	}, []);

	useInterval(() => {
		setResetTimer(!resetTimer);
		Axios.get("https://universalis.app/api/v2/light/" + itemIds).then((response) => {
			let refreshFlippingData = combineFlippingData(loadData, response.data);
			if (JSON.stringify(refreshFlippingData) !== JSON.stringify(tableData)) {
				setUpdateTime(new Date());
				setTableData(refreshFlippingData);
			}
			setProgress(0);
		});
	}, 60000);

	if (!loading) {
		return (
			<Paper style={{ marginBottom: "1em" }}>
				<ComponentTopBar
					barName="Flipping"
					resetTimer={resetTimer}
					updateTime={getDifferenceString(updateTime)}
				/>
				{tableData.map((itemElement) => {
					return (
						<Accordion key={itemElement.itemId + itemElement.itemName}>
							<AccordionSummary
								expandIcon={<ExpandMoreIcon />}
								aria-controls="panel1a-content"
								id="panel1a-header"
							>
								<Typography sx={{ width: "33%", flexShrink: 0 }}>{itemElement.itemName}</Typography>
								<Typography sx={{ width: "33%", color: "text.secondary" }}>
									{itemElement.lowestTwinPrice + " Gil"}
								</Typography>
								<Typography sx={{ width: "33%", color: "text.secondary" }}>
									{itemElement.timeSinceUpdate}
								</Typography>
							</AccordionSummary>
							<AccordionDetails>
								<Box sx={{ width: "100%", marginBottom: "1em" }}>
									<a href={`https://universalis.app/market/${itemElement.itemId}`} target="blank">
										View on Universalis
									</a>
								</Box>

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
				})}
			</Paper>
		);
	} else {
		return (
			<ComponentTopBar
				barName="Flipping - Loading..."
				progress={progress}
				updateTime={getDifferenceString(updateTime)}
			/>
		);
	}
}
