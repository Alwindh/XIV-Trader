import React from "react";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
const loadData = require("../github.json");

export default function FooterBar(props) {
	console.log(loadData);
	return (
		<Box>
			<AppBar
				position="absolute"
				color="transparent"
				style={{ bottom: "0", top: "revert", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.2)" }}
			>
				build {loadData.commit}
			</AppBar>
		</Box>
	);
}
