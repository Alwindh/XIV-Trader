import React, { useState, useEffect } from "react";
import BasicTable from "./unionTable.comp";
import Axios from "axios";

import { getItemIds, combineUnionData, getDifferenceString } from "../helpers/dataTools.helper";
import ComponentTopBar from "./compBar.comp";
import { Paper } from "@mui/material";

const loadData = require("../data/union.data.json");
const itemIds = getItemIds(loadData);

export default function UnionComp() {
	const [tableData, setTableData] = useState();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		Axios.get("https://universalis.app/api/v2/33/" + itemIds).then((response) => {
			const responseData = combineUnionData(loadData, response.data);
			setTableData(responseData);
			setLoading(false);
		});
	}, []);

	return (
		<Paper style={{ marginBottom: "1em" }}>
			<ComponentTopBar barName="Union" loading={loading} updateTime={getDifferenceString(new Date())} />

			<BasicTable data={tableData} loading={loading} />
		</Paper>
	);
}
