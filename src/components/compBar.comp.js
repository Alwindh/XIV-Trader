import React from "react";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import TimerBubble from "./timerBubble.comp";

export default function ComponentTopBar(props) {
	return (
		<Box>
			<AppBar position="static" style={{ paddingTop: "1em", paddingBottom: "1em" }}>
				<Grid container spacing={2}>
					<Grid item xs={4}>
						<Typography style={{ marginLeft: "1em" }}>{props.barName}</Typography>
					</Grid>
					<Grid item xs={7}>
						<Typography>{"Last updated " + props.updateTime}</Typography>
					</Grid>
					<Grid item xs={1} style={{ textAlign: "right" }}>
						<TimerBubble resetTimer={props.resetTimer} />
					</Grid>
				</Grid>
			</AppBar>
		</Box>
	);
}
