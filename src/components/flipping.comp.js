import React, { useState, useEffect } from "react";
import { useInterval } from "../helpers/interval.helper";
import Axios from "axios";
import Paper from "@mui/material/Paper";

import { getItemIds, combineFlippingData, getDifferenceString } from "../helpers/dataTools.helper";
import ComponentTopBar from "./compBar.comp";
import FlippingItem from "./flippingItem.comp";

const loadData = require("../data/flipping.data.json");
const itemIds = getItemIds(loadData);

export default function FlippingComp() {
	const [tableData, setTableData] = useState();
	const [loading, setLoading] = useState(true);
	const [updateTime, setUpdateTime] = useState();
	const [progress, setProgress] = useState(0);
	const [resetTimer, setResetTimer] = useState(true);
	const [candleStickData, setCandleStickData] = useState({});

	useEffect(() => {
		setLoading(true);
		setProgress(0);
		Axios.get(
			"https://universalis.app/api/history/33/" +
				itemIds +
				"?entries=999999&statsWithin=2678400&entriesWithin=2678400"
		).then((response) => {
			let candleStickArray = {};
			response.data.items.forEach((itemListing) => {
				candleStickArray[itemListing.itemID] = itemListing;
			});
			setCandleStickData(candleStickArray);
		});
		Axios.get("https://universalis.app/api/v2/light/" + itemIds).then((response) => {
			let flippingData = combineFlippingData(loadData, response.data);
			setTableData(flippingData);
			setUpdateTime(new Date());
			setLoading(false);
		});
	}, []);

	useInterval(() => {
		setResetTimer(!resetTimer);
		Axios.get("https://universalis.app/api/v2/light/" + itemIds).then((response) => {
			let refreshFlippingData = combineFlippingData(loadData, response.data);
			if (JSON.stringify(refreshFlippingData) !== JSON.stringify(tableData)) {
				setUpdateTime(new Date());
				setTableData(refreshFlippingData);
			}
			setProgress(0);
		});
	}, 60000);

	if (!loading) {
		return (
			<Paper style={{ marginBottom: "1em" }}>
				<ComponentTopBar
					barName="Flipping"
					resetTimer={resetTimer}
					updateTime={getDifferenceString(updateTime)}
				/>
				{tableData.map((itemElement) => {
					return (
						<FlippingItem
							inputItem={itemElement}
							key={itemElement.itemName}
							inputData={candleStickData[itemElement.itemId]}
						/>
					);
				})}
			</Paper>
		);
	} else {
		return (
			<ComponentTopBar
				barName="Flipping - Loading..."
				progress={progress}
				updateTime={getDifferenceString(updateTime)}
			/>
		);
	}
}
