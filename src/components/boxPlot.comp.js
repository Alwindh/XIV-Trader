import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export default function UnionComp(props) {
	const [barData, setBarData] = useState();
	const [barOptions] = useState({
		chart: {
			type: "boxPlot",
			height: 350,
			toolbar: {
				show: false,
			},
			zoom: {
				enabled: false,
			},
		},

		xaxis: {
			type: "datetime",
		},
		yaxis: {
			tooltip: {
				enabled: true,
			},
		},
		noData: {
			text: "Loading data...",
			align: "center",
			verticalAlign: "middle",
			offsetX: 0,
			offsetY: 0,
			style: {
				color: undefined,
				fontSize: "14px",
				fontFamily: undefined,
			},
		},
	});

	function generateCandleStick(inputData) {
		let sortingArray = {};
		const copyData = inputData.entries.slice();
		copyData.forEach((entry) => {
			let dateObject = new Date(entry.timestamp * 1000);

			dateObject.setHours(0);
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
			});
		}
		let candleStickArray = [];
		for (let key in priceArray) {
			const listingPrices = priceArray[key];
			listingPrices.sort(function (a, b) {
				return a - b;
			});
			const minPrice = listingPrices[0];
			const maxPrice = listingPrices[listingPrices.length - 1];
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
		if (props.inputData) {
			generateCandleStick(props.inputData);
		}
	}, [props]);

	if (barData) {
		return (
			<div id="chart">
				<Chart options={barOptions} series={barData} type="boxPlot" height={350} />
			</div>
		);
	} else {
		return (
			<Box sx={{ display: "flex" }}>
				<CircularProgress />
			</Box>
		);
	}
}
