import React, { useState, useEffect } from "react";
import BasicTable from "../components/basicTable.comp";
import Container from "@mui/material/Container";
import Axios from "axios";

import { getItemIds, combineData } from "../helpers/dataTools.helper";

const loadData = require("../data/union.data.json");
const itemIds = getItemIds(loadData);

export default function UnionComp(props) {
	const [tableData, setTableData] = useState();

	useEffect(() => {
		Axios.get("https://universalis.app/api/v2/33/" + itemIds).then((response) => {
			const responseData = combineData(loadData, response.data);
			setTableData(responseData);
		});
	}, []);

	return (
		tableData && (
			<Container>
				<BasicTable data={tableData} />;
			</Container>
		)
	);
}
