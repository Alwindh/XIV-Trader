import React, { useState, useEffect } from "react";
import BasicTable from "./unionTable.comp";
import Container from "@mui/material/Container";
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

export default function UnionComp(props) {
	const [tableData, setTableData] = useState();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		Axios.get("https://universalis.app/api/v2/light/" + itemIds).then((response) => {
			let flippingData = combineFlippingData(loadData, response.data);
			setTableData(flippingData);
			setLoading(false);
		});
	}, []);

	return (
		!loading && (
			<Container>
				{tableData.map((itemElement) => {
					if (itemElement.viableListings.length > 0) {
						return (
							<Accordion key={itemElement.itemId}>
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
			</Container>
		)
	);
}
