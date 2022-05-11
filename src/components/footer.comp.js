import React from "react";
const loadData = require("../github.json");

export default function FooterBar() {
	return (
		<div
			style={{
				width: "100%",
				flexShrink: "0",
				backgroundColor: "rgba(0, 0, 0, 0.2)",
			}}
		>
			build {loadData.commit.slice(0, 7)}
		</div>
	);
}
