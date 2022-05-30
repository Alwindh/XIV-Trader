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
					<img
						style={{ marginTop: "-4px", marginBottom: "-4px", marginRight: "1em" }}
						height="32px"
						alt=""
						src={
							"https://universalis-ffxiv.github.io/universalis-assets/icon2x/" +
							props.inputItem.itemId +
							".png"
						}
					/>
					<Typography sx={{ width: "33%", flexShrink: 0 }}>
						{props.inputItem.itemName.slice(props.inputItem.itemName.length - 2) === "HQ"
							? props.inputItem.itemName.slice(0, props.inputItem.itemName.length - 2)
							: props.inputItem.itemName}
						{props.inputItem.itemName.slice(props.inputItem.itemName.length - 2) === "HQ" ? (
							<img height="16px" style={{ marginLeft: "0.5em" }} alt="hq" src="/hq.png" />
						) : (
							""
						)}
					</Typography>
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
								<Grid item xs={1}></Grid>
								<Grid item xs={1}>
									{listing.pricePerUnit + " gil"}
								</Grid>
								<Grid item xs={1}>
									{listing.quantity}
								</Grid>
								<Grid item xs={1}>
									{listing.hq ? (
										<img height="16px" style={{ marginLeft: "0.5em" }} alt="hq" src="/hq.png" />
									) : (
										""
									)}
								</Grid>
								<Grid item xs={3}>
									{listing.worldName}
								</Grid>
								<Grid item xs={3}>
									{listing.timeString}
								</Grid>
								<Grid item xs={1}></Grid>
							</Grid>
						);
					})}
				</AccordionDetails>
			</Paper>
		</Accordion>
	);
}
