import { useEffect, useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import BoxPlotChart from "./boxPlot.comp";

export default function FlippingItem(props) {
	const [maxHeight, setMaxHeight] = useState();
	useEffect(() => {
		const baseHeight = 365 + 50;
		const numItems = props.inputItem.viableListings.slice(0, 10).length;
		const maxHeight = 8 + 16 + baseHeight + numItems * 24;
		setMaxHeight(`${maxHeight}px`);
	}, [props.inputItem.viableListings]);

	return (
		<Accordion TransitionProps={{ unmountOnExit: true }} key={props.inputItem.itemId + props.inputItem.itemName}>
			<Paper elevation={8}>
				<AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
					<Typography sx={{ width: "33%", flexShrink: 0 }}>{props.inputItem.itemName}</Typography>
					<Typography sx={{ width: "33%", color: "text.secondary" }}>
						{props.inputItem.lowestTwinPrice + " Gil"}
					</Typography>
					<Typography sx={{ width: "33%", color: "text.secondary" }}>
						{props.inputItem.timeSinceUpdate}
					</Typography>
				</AccordionSummary>
			</Paper>
			<Paper square elevation={4}>
				<AccordionDetails style={{ height: maxHeight }}>
					<BoxPlotChart inputName={props.inputItem.itemName} inputData={props.inputData} />

					<Box style={{ width: "100%", marginBottom: "25px", height: "25px" }}>
						<a href={`https://universalis.app/market/${props.inputItem.itemId}`} target="blank">
							View on Universalis
						</a>
					</Box>

					{props.inputItem.viableListings.slice(0, 10).map((listing) => {
						return (
							<Grid container spacing={2} key={listing.listingId}>
								<Grid item xs={1}>
									{listing.pricePerUnit}
								</Grid>
								<Grid item xs={1}>
									{listing.quantity}
								</Grid>
								<Grid item xs={1}>
									{listing.hq ? "HQ" : ""}
								</Grid>
								<Grid item xs={4}>
									{listing.worldName}
								</Grid>
								<Grid item xs={5}>
									{listing.timeString}
								</Grid>
							</Grid>
						);
					})}
				</AccordionDetails>
			</Paper>
		</Accordion>
	);
}
