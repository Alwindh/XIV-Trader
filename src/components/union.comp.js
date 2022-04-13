import React, { useState, useEffect } from "react";
import BasicTable from "./unionTable.comp";
import Container from "@mui/material/Container";
import Axios from "axios";

import { getItemIds, combineUnionData } from "../helpers/dataTools.helper";

const loadData = require("../data/union.data.json");
const itemIds = getItemIds(loadData);

export default function UnionComp(props) {
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
		!loading && (
			<Container>
				<BasicTable data={tableData} loading={loading} />
			</Container>
		)
	);
}
