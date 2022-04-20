import React, { useState, useEffect } from "react";
import LinearProgress from "@mui/material/LinearProgress";

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

	return <LinearProgress color="secondary" variant="determinate" value={progress} />;
}
