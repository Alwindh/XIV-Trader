import React, { useState, useEffect } from "react";
import Axios from "axios";
import Chart from "react-apexcharts";

export default function UnionComp() {
	const [barData, setBarData] = useState();
	const [barOptions] = useState({
		chart: {
			type: "boxPlot",
			height: 350,
		},
		title: {
			text: "price chart",
			align: "left",
		},
		xaxis: {
			type: "datetime",
		},
		yaxis: {
			tooltip: {
				enabled: true,
			},
		},
	});

	function generateCandleStick(inputData) {
		let sortingArray = {};
		const copyData = inputData.entries.slice();
		copyData.forEach((entry) => {
			let dateObject = new Date(entry.timestamp * 1000);
			let closestHours = 0;
			if (dateObject.getHours() >= 12) {
				closestHours = 12;
			}
			dateObject.setHours(closestHours);
			dateObject.setMinutes(0);
			dateObject.setSeconds(0);
			const unixStamp = Math.floor(dateObject.getTime() / 1000);
			entry["unixDayStamp"] = unixStamp;
			if (sortingArray[unixStamp] === undefined) {
				sortingArray[unixStamp] = [];
			}
			sortingArray[unixStamp].push(entry);
		});
		let priceArray = {};
		for (let key in sortingArray) {
			priceArray[key] = [];
			sortingArray[key].forEach((listing) => {
				priceArray[key].push(listing.pricePerUnit);
				// for (let index = 0; index < listing.quantity; index++) {
				// 	priceArray[key].push(listing.pricePerUnit);
				// }
			});
		}
		let candleStickArray = [];
		for (let key in priceArray) {
			const listingPrices = priceArray[key];
			listingPrices.sort(function (a, b) {
				return a - b;
			});
			const minPrice = listingPrices[1];
			const maxPrice = listingPrices[listingPrices.length - 2];
			const lowerQuart = listingPrices[Math.floor(listingPrices.length * 0.25)];
			const upperQuart = listingPrices[Math.floor(listingPrices.length * 0.75)];
			const median = listingPrices[Math.floor(listingPrices.length * 0.5)];
			const dateObject = new Date(key * 1000);
			const dataEntry = { x: dateObject, y: [minPrice, lowerQuart, median, upperQuart, maxPrice] };
			candleStickArray.push(dataEntry);
		}
		setBarData([{ data: candleStickArray }]);
	}

	useEffect(() => {
		Axios.get("https://universalis.app/api/history/light/37279?entries=999999").then((response) => {
			generateCandleStick(response.data);
		});
	}, []);

	if (barData) {
		return (
			<div id="chart">
				<Chart options={barOptions} series={barData} type="boxPlot" height={350} />
			</div>
		);
	}
}
