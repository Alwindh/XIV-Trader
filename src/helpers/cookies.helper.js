function setCookie(cname, cvalue) {
	document.cookie = cname + "=" + cvalue + ";path=/; Max-Age=31556926";
}

// function deleteCookie(cname) {
// 	document.cookie = cname + "=''" + ";path=/; Max-Age=0";
// }

function getCookie(cname) {
	let name = cname + "=";
	let decodedCookie = decodeURIComponent(document.cookie);
	let ca = decodedCookie.split(";");
	for (let i = 0; i < ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) === " ") {
			c = c.substring(1);
		}
		if (c.indexOf(name) === 0) {
			return c.substring(name.length, c.length);
		}
	}
	return false;
}

export function CheckSettings() {
	let dataCenterCookie = getCookie("datacenter");
	let serverCookie = getCookie("server");
	let priceCookie = getCookie("price");

	let returnDict = { dataCenter: dataCenterCookie, server: serverCookie, price: priceCookie };
	const validCookie = Object.keys(returnDict).every((element) => {
		return returnDict[element] !== false;
	});
	return validCookie ? returnDict : false;
}

export function SetSettings(settingsDict) {
	Object.keys(settingsDict).forEach((element) => {
		setCookie(element, settingsDict[element]);
	});
}
