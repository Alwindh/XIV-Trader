export function getItemIds(listOfItems) {
	let itemString = "";
	listOfItems.forEach((element) => {
		itemString += element.itemId + ",";
	});
	return itemString.slice(0, -1);
}

export function combineData(mainList, responseObject) {
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

			element["itemValue"] = element["itemGilValue"] / element["itemCost"];
			newList.push(element);
		} catch (error) {}
	});
	const parameterList = ["itemVelocity", "stDev", "itemValue"];
	const minMax = findMinMax(newList, parameterList);
	newList.forEach((itemElement) => {
		itemElement["ScoreValues"] = 0;
		parameterList.forEach((parameterElement) => {
			const itemValue = itemElement[parameterElement];
			const itemMin = minMax[parameterElement]["min"];
			const itemMax = minMax[parameterElement]["max"];
			const itemScore = (itemValue - itemMin) * (100 / (itemMax - itemMin));
			itemElement[parameterElement + "Score"] = itemScore;
			itemElement["ScoreValues"] += itemScore;
		});
		itemElement["Score"] = itemElement["ScoreValues"] / 3;
	});
	newList.sort((a, b) => {
		return b.Score - a.Score;
	});
	console.log(newList);

	return newList;
}

function getStdev(array) {
	const n = array.length;
	const mean = array.reduce((a, b) => a + b) / n;
	return Math.sqrt(array.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n);
}

function getMedian(array) {
	array.sort();
	return array[1];
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
		minMaxDict[parameterElement]["min"] = Math.min(...minMaxDict[parameterElement]["values"]);
		minMaxDict[parameterElement]["max"] = Math.max(...minMaxDict[parameterElement]["values"]);
	});
	return minMaxDict;
}
