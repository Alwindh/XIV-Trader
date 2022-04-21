import React, { useState, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";

export default function FlippingComp(props) {
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		setProgress(0);
	}, [props.resetTimer]);

	useEffect(() => {
		const timer = setInterval(() => {
			setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 2 / 6));
		}, 200);
		return () => {
			clearInterval(timer);
		};
	}, []);

	return (
		<CircularProgress
			style={{ marginRight: "1em" }}
			size="1.4em"
			color="warning"
			variant="determinate"
			value={progress}
		/>
	);
}
