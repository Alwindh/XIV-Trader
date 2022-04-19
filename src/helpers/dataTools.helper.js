export function getItemIds(listOfItems) {
	let itemString = "";
	listOfItems.forEach((element) => {
		itemString += element.itemId + ",";
	});
	return itemString.slice(0, -1);
}

export function combineUnionData(mainList, responseObject) {
	let newList = [];
	mainList.forEach((element) => {
		const itemId = element.itemId;
		try {
			element["itemVelocity"] = responseObject.items[itemId]["regularSaleVelocity"];
			element["itemMinimum"] = responseObject.items[itemId]["minPrice"];
			element["itemCurrentAverage"] = responseObject.items[itemId]["currentAveragePrice"];
			element["itemHistoricAverage"] = responseObject.items[itemId]["averagePrice"];
			element["pricesList"] = [
				element["itemMinimum"],
				element["itemCurrentAverage"],
				element["itemHistoricAverage"],
			];
			element["itemGilValue"] = getMedian(element["pricesList"]);
			element["stDev"] = (getStdev(element["pricesList"]) / element["itemGilValue"]) * 100;
			element["forSale"] = 0;
			responseObject.items[itemId]["listings"].forEach((listing) => {
				element["forSale"] += listing.quantity;
			});
			element["numListings"] = element["forSale"] / responseObject.items[itemId]["listings"].length;
			element["itemValue"] = element["itemGilValue"] / element["itemCost"];
			newList.push(element);
		} catch (error) {}
	});
	const parameterList = ["itemVelocity", "stDev", "itemValue", "numListings"];
	const minMax = findMinMax(newList, parameterList);

	newList.forEach((itemElement) => {
		itemElement["ScoreValues"] = 0;
		parameterList.forEach((parameterElement) => {
			let itemValue = itemElement[parameterElement];
			const itemLower = minMax[parameterElement]["lowerFence"];
			const itemUpper = minMax[parameterElement]["upperFence"];
			let itemScore = (itemValue - itemLower) * (100 / (itemUpper - itemLower));
			if (itemScore < 0) {
				itemScore = 0;
			} else if (itemScore > 100) {
				itemScore = 100;
			}

			if (parameterElement === "stDev") {
				itemScore = 100 - itemScore;
			}

			itemElement[parameterElement + "Score"] = itemScore;
			itemElement["ScoreValues"] += itemScore;
		});
		itemElement["Score"] = itemElement["ScoreValues"] / parameterList.length;
	});
	newList.sort((a, b) => {
		return b.Score - a.Score;
	});
	return newList;
}

export function combineFlippingData(mainList, responseObject, hqOnly = false) {
	let newArray = mainList.slice();
	newArray.forEach((itemElement) => {
		const responseItem = responseObject.items[itemElement.itemId];
		let lowerListings = [];
		let lowestTwinListings = [];
		if (itemElement.itemName.includes("Grade 6 Tincture") && hqOnly) {
			responseItem.listings.every((listingElement) => {
				if (listingElement.worldID === 33 && listingElement.hq) {
					lowestTwinListings.push(listingElement.pricePerUnit);
					if (lowestTwinListings.length >= 3) {
						return false;
					}
				} else if (listingElement.hq) {
					lowerListings.push(listingElement);
				}
				return true;
			});
		} else {
			responseItem.listings.every((listingElement) => {
				if (listingElement.worldID === 33) {
					lowestTwinListings.push(listingElement.pricePerUnit);
					if (lowestTwinListings.length >= 3) {
						return false;
					}
				} else {
					lowerListings.push(listingElement);
				}
				return true;
			});
		}

		const lowestTwinPrice = getMedian(lowestTwinListings);
		itemElement["lowestTwinPrice"] = lowestTwinPrice;
		const underCutValue = lowestTwinPrice * 0.75;
		let viableListings = [];
		let idCounter = 0;
		let timeSinceUpdate = null;
		lowerListings.forEach((listingElement) => {
			if (listingElement.pricePerUnit <= underCutValue) {
				listingElement["timeString"] = getDifferenceString(listingElement.lastReviewTime * 1000);
				if (timeSinceUpdate === null || timeSinceUpdate < listingElement.lastReviewTime * 1000) {
					timeSinceUpdate = listingElement.lastReviewTime * 1000;
				}
				listingElement["listingId"] = itemElement.itemId + "-" + idCounter;
				idCounter += 1;
				viableListings.push(listingElement);
			}
		});
		itemElement["viableListings"] = viableListings;

		const timeDifferenceString = getDifferenceString(timeSinceUpdate);
		itemElement["timeSinceUpdate"] = timeDifferenceString;
	});
	return newArray;
}

export function combineMountsData(mainList, responseObject) {
	mainList.forEach((itemElement) => {
		const responseItem = responseObject.items[itemElement.itemId];
		let mountListings = [];
		responseItem.listings.every((listingElement) => {
			mountListings.push(listingElement);
			if (mountListings.length >= 5) {
				return false;
			}

			return true;
		});
		itemElement["mountListings"] = mountListings;
		itemElement["undercutFactor"] =
			mountListings[0].pricePerUnit / mountListings[mountListings.length - 1].pricePerUnit;

		// const lowestTwinPrice = getMedian(lowestTwinListings);
		// itemElement["lowestTwinPrice"] = lowestTwinPrice;
		// const underCutValue = lowestTwinPrice * 0.75;
		// let viableListings = [];
		// let idCounter = 0;
		let timeSinceUpdate = null;
		mountListings.forEach((listingElement) => {
			// 	if (listingElement.pricePerUnit <= underCutValue) {
			// 		listingElement["timeString"] = getDifferenceString(listingElement.lastReviewTime * 1000);
			if (timeSinceUpdate === null || timeSinceUpdate < listingElement.lastReviewTime * 1000) {
				timeSinceUpdate = listingElement.lastReviewTime * 1000;
			}
			// 		listingElement["listingId"] = itemElement.itemId + "-" + idCounter;
			// 		idCounter += 1;
			// 		viableListings.push(listingElement);
			// }
		});
		// itemElement["viableListings"] = viableListings;

		const timeDifferenceString = getDifferenceString(timeSinceUpdate);
		itemElement["timeSinceUpdate"] = timeDifferenceString;
	});
	let newList = [];
	mainList.forEach((itemElement) => {
		if (itemElement.undercutFactor <= 0.75) {
			newList.push(itemElement);
		}
	});
	return newList;
}

export function getDifferenceString(listingTime) {
	const timeNow = new Date();
	const timeUpdate = new Date(listingTime);
	const timeDifference = timeNow.getTime() - timeUpdate.getTime();
	const DaysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
	let DaysDifferenceString = "";
	if (DaysDifference === 1) {
		DaysDifferenceString = DaysDifference + " day";
	} else if (DaysDifference > 1) {
		DaysDifferenceString = DaysDifference + " days";
	}
	const HoursDifference = Math.floor(timeDifference / (1000 * 60 * 60)) - DaysDifference * 24;
	let HoursDifferenceString = "";
	let DayHourComma = DaysDifference > 0 ? ", " : "";
	if (HoursDifference === 1) {
		HoursDifferenceString = DayHourComma + HoursDifference + " hour";
	} else if (HoursDifference > 1) {
		HoursDifferenceString = DayHourComma + HoursDifference + " hours";
	}
	const MinutesDifference =
		Math.floor(timeDifference / (1000 * 60)) - (HoursDifference * 60 + DaysDifference * 24 * 60);
	let MinutesDifferenceString = "<1 minute";
	let HourMinComma = HoursDifference > 0 ? ", " : "";

	if (MinutesDifference === 1) {
		MinutesDifferenceString = HourMinComma + MinutesDifference + " minute";
	} else if (MinutesDifference > 1) {
		MinutesDifferenceString = HourMinComma + MinutesDifference + " minutes";
	}
	const timeDifferenceString = DaysDifferenceString + HoursDifferenceString + MinutesDifferenceString + " ago.";
	return timeDifferenceString;
}

function getStdev(array) {
	const n = array.length;
	const mean = array.reduce((a, b) => a + b) / n;
	return Math.sqrt(array.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n);
}

function getMedian(array) {
	let middle = Math.floor(array.length / 2);
	array = [...array].sort((a, b) => a - b);
	return array.length % 2 !== 0 ? array[middle] : (array[middle - 1] + array[middle]) / 2;
}

function findMinMax(newList, parameterList) {
	let minMaxDict = {};
	parameterList.forEach((parameterElement) => {
		minMaxDict[parameterElement] = { values: [] };
	});
	newList.forEach((itemElement) => {
		parameterList.forEach((parameterElement) => {
			minMaxDict[parameterElement].values.push(itemElement[parameterElement]);
		});
	});
	parameterList.forEach((parameterElement) => {
		const sortedArray = [...minMaxDict[parameterElement]["values"]].sort((a, b) => a - b);
		const lowerQuart = sortedArray[parseInt(0.25 * sortedArray.length)];
		const upperQuart = sortedArray[parseInt(0.75 * sortedArray.length)];

		minMaxDict[parameterElement]["lowerFence"] = lowerQuart;
		minMaxDict[parameterElement]["upperFence"] = upperQuart;

		minMaxDict[parameterElement]["min"] = Math.min(...minMaxDict[parameterElement]["values"]);
		minMaxDict[parameterElement]["max"] = Math.max(...minMaxDict[parameterElement]["values"]);
	});
	return minMaxDict;
}
