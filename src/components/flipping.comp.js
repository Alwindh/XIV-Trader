import React, { useState, useEffect } from "react";
import { useInterval } from "../helpers/interval.helper";
import Axios from "axios";
import Paper from "@mui/material/Paper";

import { getItemIds, combineFlippingData, getDifferenceString, getLowPrices } from "../helpers/dataTools.helper";
import ComponentTopBar from "./compBar.comp";
import FlippingItem from "./flippingItem.comp";

const loadData = require("../data/flipping.data.json");
const itemIds = getItemIds(loadData);

export default function FlippingComp() {
	const [tableData, setTableData] = useState();
	const [historyPrices, sethistoryPrices] = useState();
	const [listingsResponse, setListingsResponse] = useState();
	const [loading, setLoading] = useState(true);
	const [updateTime, setUpdateTime] = useState();
	const [progress, setProgress] = useState(0);
	const [resetTimer, setResetTimer] = useState(true);
	const [boxPlotData, setboxPlotData] = useState({});

	useEffect(() => {
		setLoading(true);
		setProgress(0);
		Axios.get(
			"https://universalis.app/api/history/33/" +
				itemIds +
				"?entries=999999&statsWithin=2678400&entriesWithin=2678400"
		).then((response) => {
			const lowPrices = getLowPrices(response.data);
			let candleStickArray = {};
			response.data.items.forEach((itemListing) => {
				candleStickArray[itemListing.itemID] = itemListing;
			});
			setboxPlotData(candleStickArray);
			sethistoryPrices(lowPrices);
		});
		Axios.get("https://universalis.app/api/v2/light/" + itemIds).then((response) => {
			setListingsResponse(response.data);
		});
	}, []);

	useEffect(() => {
		if (historyPrices && listingsResponse) {
			let flippingData = combineFlippingData(loadData, listingsResponse, historyPrices);
			setTableData(flippingData);
			setUpdateTime(new Date());
		}
	}, [historyPrices, listingsResponse]);

	useEffect(() => {
		if (tableData) {
			setLoading(false);
		}
	}, [tableData]);

	useInterval(() => {
		setResetTimer(!resetTimer);
		Axios.get("https://universalis.app/api/v2/light/" + itemIds).then((response) => {
			if (JSON.stringify(response.data) !== JSON.stringify(listingsResponse)) {
				setUpdateTime(new Date());
				setListingsResponse(response.data);
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
				<div className="dataHolder">
					{tableData.map((itemElement) => {
						return (
							<FlippingItem
								inputItem={itemElement}
								key={itemElement.itemName}
								inputData={boxPlotData[itemElement.itemId]}
							/>
						);
					})}
				</div>
			</Paper>
		);
	} else {
		return (
			<ComponentTopBar
				barName="Flipping - Loading..."
				loading={true}
				progress={progress}
				updateTime={getDifferenceString(updateTime)}
			/>
		);
	}
}
