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

const loadData = require("../data/mounts.data.json");
const itemIds = getItemIds(loadData);

export default function MountsComp(props) {
	const [tableData, setTableData] = useState();
	const [loading, setLoading] = useState(true);
	const [updateTime, setUpdateTime] = useState();
	const [progress, setProgress] = useState(0);
	const [resetTimer, setResetTimer] = useState(true);

	useEffect(() => {
		setProgress(0);
		setLoading(true);
		Axios.get("https://universalis.app/api/v2/light/" + itemIds).then((response) => {
			let mountsData = combineMountsData(loadData, response.data);
			setTableData(mountsData);
			setUpdateTime(new Date());
			setLoading(false);
		});
	}, []);

	useInterval(() => {
		setResetTimer(!resetTimer);
		Axios.get("https://universalis.app/api/v2/light/" + itemIds).then((response) => {
			let mountsData = combineMountsData(loadData, response.data);
			if (JSON.stringify(mountsData) !== JSON.stringify(tableData)) {
				setUpdateTime(new Date());
				setTableData(mountsData);
			}
			setProgress(0);
		});
	}, 60000);

	// useEffect(() => {
	// 	const timer = setInterval(() => {
	// 		setProgress((prevProgress) => {
	// 			if (prevProgress >= 100) {
	// 				return 0;
	// 			} else {
	// 				return prevProgress + 10 / 6;
	// 			}
	// 		});
	// 	}, 1000);
	// 	return () => {
	// 		clearInterval(timer);
	// 	};
	// }, [loading]);

	if (!loading) {
		return (
			<Paper style={{ marginBottom: "1em" }}>
				<ComponentTopBar
					barName="Mounts"
					updateTime={getDifferenceString(updateTime)}
					resetTimer={resetTimer}
				/>
				<div className="dataHolder">
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
				</div>
			</Paper>
		);
	} else {
		return (
			<ComponentTopBar
				barName="Mounts - Loading..."
				progress={progress}
				loading={true}
				updateTime={getDifferenceString(updateTime)}
			/>
		);
	}
}
