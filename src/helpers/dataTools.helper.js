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
			element["itemGilValue"] = getAverage(element["pricesList"]);
			element["stDev"] = (getStdev(element["pricesList"]) / element["itemGilValue"]) * 100;

			element["itemValue"] = element["itemGilValue"] / element["itemCost"];
			newList.push(element);
		} catch (error) {}
	});
	return newList;
}

function getStdev(array) {
	const n = array.length;
	const mean = array.reduce((a, b) => a + b) / n;
	return Math.sqrt(array.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n);
}

function getAverage(array) {
	let value = 0;
	array.forEach((element) => {
		value += element;
	});
	return value / array.length;
}
