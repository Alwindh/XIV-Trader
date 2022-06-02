import React, { useState, useEffect } from "react";
import BasicTable from "./unionTable.comp";
import Axios from "axios";

import { getItemIds, combineUnionData, getDifferenceString } from "../helpers/dataTools.helper";
import ComponentTopBar from "./compBar.comp";
import { Paper } from "@mui/material";
import { CheckSettings } from "../helpers/cookies.helper";

const loadData = require("../data/union.data.json");
const itemIds = getItemIds(loadData);

export default function UnionComp() {
	const [tableData, setTableData] = useState();
	const [loading, setLoading] = useState(true);
	const [server, setServer] = useState();
	const [cookies, setCookies] = useState();

	useEffect(() => {
		if (cookies) {
			setServer(cookies.server);
		}
	}, [cookies]);

	useEffect(() => {
		if (server) {
			Axios.get("https://universalis.app/api/v2/" + server + "/" + itemIds)
				.then((response) => {
					const responseData = combineUnionData(loadData, response.data);
					setTableData(responseData);
					setLoading(false);
				})
				.catch((error) => {
					console.log(error);
				});
		}
	}, [server]);

	useEffect(() => {
		setCookies(CheckSettings());
	}, []);
	if (!cookies) {
		return "";
	} else {
		return (
			<Paper style={{ marginTop: "1em" }}>
				<ComponentTopBar barName="Union" loading={loading} updateTime={getDifferenceString(new Date())} />

				<BasicTable data={tableData} loading={loading} />
			</Paper>
		);
	}
}
