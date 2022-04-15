import React, { useState, useEffect } from "react";
import BasicTable from "./unionTable.comp";
import Axios from "axios";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { getItemIds, combineUnionData } from "../helpers/dataTools.helper";

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
		<Accordion disabled={loading}>
			<AccordionSummary>Union</AccordionSummary>
			<AccordionDetails>
				<BasicTable data={tableData} loading={loading} />{" "}
			</AccordionDetails>
		</Accordion>
	);
}
