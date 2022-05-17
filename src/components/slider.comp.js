import * as React from "react";
import Slider from "@mui/material/Slider";
import { Box } from "@mui/material";

export default function PriceSlider(props) {
	return (
		<Box style={{ paddingLeft: "1em", paddingRight: "1em" }}>
			<Slider
				aria-label="Minimum price"
				defaultValue={100}
				valueLabelDisplay="auto"
				step={100}
				marks
				min={100}
				max={1000}
				value={typeof props.price === "number" ? props.price : 100}
				onChange={props.onChange}
			/>
		</Box>
	);
}
