import React from "react";
const loadData = require("../github.json");

export default function FooterBar() {
	return (
		<div
			style={{
				width: "100%",
				flexShrink: "0",
				height: "25px",
				backgroundColor: "rgba(0, 0, 0, 0.2)",
				textAlign: "center",
			}}
		>
			build {loadData.commit.slice(0, 7)}
		</div>
	);
}
