import React, { useState, useEffect } from "react";

import Axios from "axios";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Grid from "@mui/material/Grid";

import { getItemIds, combineMountsData } from "../helpers/dataTools.helper";

const loadData = require("../data/mounts.data.json");
const itemIds = getItemIds(loadData);

export default function MountsComp(props) {
	const [tableData, setTableData] = useState();
	const [loading, setLoading] = useState(true);
	const [updateTime, setUpdateTime] = useState();
	const [refreshTime, setRefreshTime] = useState();

	useEffect(() => {
		Axios.get("https://universalis.app/api/v2/light/" + itemIds).then((response) => {
			let mountsData = combineMountsData(loadData, response.data);
			setTableData(mountsData);
			setRefreshTime(new Date().toString());
			setUpdateTime(new Date().toString());
			setLoading(false);
		});
	}, []);

	// useEffect(() => {
	// 	setTimeout(() => {
	// 		Axios.get("https://universalis.app/api/v2/light/" + itemIds).then((response) => {
	// 			let mountsData = combineMountsData(loadData, response.data);
	// 			console.log(mountsData !== tableData);
	// 			if (mountsData !== tableData) {
	// 				setUpdateTime(new Date().toString());
	// 				setTableData(mountsData);
	// 				console.log("did a thing");
	// 			}
	// 			setRefreshTime(new Date().toString());

	// 			console.log("REFRESHED");
	// 			setLoading(false);
	// 		});
	// 	}, 60000);
	// });

	if (!loading) {
		return (
			<Accordion>
				<AccordionSummary>
					Mounts {updateTime} {refreshTime}
				</AccordionSummary>
				<AccordionDetails>
					{tableData.map((itemElement) => {
						return (
							<Accordion key={itemElement.itemId}>
								<AccordionSummary
									expandIcon={<ExpandMoreIcon />}
									aria-controls="panel1a-content"
									id="panel1a-header"
								>
									<Typography sx={{ width: "33%", flexShrink: 0 }}>{itemElement.itemName}</Typography>
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
				</AccordionDetails>
			</Accordion>
		);
	} else {
		return (
			<Accordion disabled={loading}>
				<AccordionSummary>Mounts - loading...</AccordionSummary>
				<AccordionDetails>null</AccordionDetails>
			</Accordion>
		);
	}
}
