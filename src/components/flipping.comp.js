import React, { useState, useEffect } from "react";
import { useInterval } from "../helpers/interval.helper";
import Axios from "axios";
import Paper from "@mui/material/Paper";

import { getItemIds, combineFlippingData, getDifferenceString, getLowPrices } from "../helpers/dataTools.helper";
import ComponentTopBar from "./compBar.comp";
import FlippingItem from "./flippingItem.comp";

import { CheckSettings } from "../helpers/cookies.helper";

export default function FlippingComp() {
	const [itemIds, setItemIds] = useState();
	const [loadData, setLoadData] = useState();
	const [tableData, setTableData] = useState();
	const [historyResponse, setHistoryResponse] = useState();
	const [historyPrices, sethistoryPrices] = useState();
	const [listingsResponse, setListingsResponse] = useState();
	const [loading, setLoading] = useState(true);
	const [updateTime, setUpdateTime] = useState();
	const [progress, setProgress] = useState(0);
	const [resetTimer, setResetTimer] = useState(true);
	const [boxPlotData, setboxPlotData] = useState({});
	const [dataCenter, setDataCenter] = useState();
	const [server, setServer] = useState();
	const [cookies, setCookies] = useState();
	const [cutOffPrice, setcutOffPrice] = useState();

	useEffect(() => {
		setLoading(true);
		setProgress(0);
		setCookies(CheckSettings());
		Axios.get("/api/data/get/top").then((response) => {
			setLoadData(response.data);
			const itemIds = getItemIds(response.data);
			setItemIds(itemIds);
		});
	}, []);

	useEffect(() => {
		if (cookies) {
			setDataCenter(cookies.dataCenter);
			setServer(cookies.server);
			setcutOffPrice(cookies.price);
		}
	}, [cookies]);

	useEffect(() => {
		if (server && dataCenter && itemIds) {
			Axios.get(
				"https://universalis.app/api/history/" +
					server +
					"/" +
					itemIds +
					"?entries=999999&statsWithin=2678400&entriesWithin=2678400"
			).then((response) => {
				setHistoryResponse(response.data);
			});
			Axios.get("https://universalis.app/api/v2/" + dataCenter + "/" + itemIds).then((response) => {
				setListingsResponse(response.data);
			});
		}
	}, [server, dataCenter, itemIds]);

	useEffect(() => {
		if (itemIds) {
		}
	}, [itemIds]);

	useEffect(() => {
		if (historyResponse) {
			const lowPrices = getLowPrices(historyResponse);
			sethistoryPrices(lowPrices);
			let candleStickArray = {};
			historyResponse.items.forEach((itemListing) => {
				candleStickArray[itemListing.itemID] = itemListing;
			});
			setboxPlotData(candleStickArray);
		}
	}, [historyResponse]);

	useEffect(() => {
		if (historyPrices && listingsResponse && loadData && cutOffPrice) {
			let flippingData = combineFlippingData(loadData, listingsResponse, historyPrices, cutOffPrice);
			setTableData(flippingData);
			setUpdateTime(new Date());
		}
	}, [historyPrices, listingsResponse, loadData, cutOffPrice]);

	useEffect(() => {
		if (tableData) {
			setLoading(false);
		}
	}, [tableData]);

	useInterval(() => {
		// this needs major overhaul
		setResetTimer(!resetTimer);
		Axios.get("https://universalis.app/api/v2/" + dataCenter + "/" + itemIds).then((response) => {
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
