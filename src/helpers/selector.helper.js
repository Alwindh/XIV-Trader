const serverData = require("../data/servers.data.json");

export function getDataCenterOptions() {
	let dataCenterOptions = [];
	Object.keys(serverData).forEach((dataCenter) => {
		let option = {};
		option["optionValue"] = dataCenter;
		option["optionName"] = dataCenter;
		dataCenterOptions.push(option);
	});
	return dataCenterOptions;
}

export function getServerOptions(dataCenter) {
	return serverData[dataCenter];
}
