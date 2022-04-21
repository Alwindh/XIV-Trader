import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

export default function FlippingItem(props) {
	return (
		<Accordion key={props.inputItem.itemId + props.inputItem.itemName}>
			<AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
				<Typography sx={{ width: "33%", flexShrink: 0 }}>{props.inputItem.itemName}</Typography>
				<Typography sx={{ width: "33%", color: "text.secondary" }}>
					{props.inputItem.lowestTwinPrice + " Gil"}
				</Typography>
				<Typography sx={{ width: "33%", color: "text.secondary" }}>
					{props.inputItem.timeSinceUpdate}
				</Typography>
			</AccordionSummary>
			<AccordionDetails>
				<Box sx={{ width: "100%", marginBottom: "1em" }}>
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
}
