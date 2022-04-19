import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";

const columns = [
	{ field: "itemName", headerName: "Item Name", flex: 150 },
	{
		field: "itemCost",
		type: "number",
		headerName: "Union Cost",
		flex: 100,
	},
	{
		field: "itemGilValue",
		type: "number",
		headerName: "Gil Value",
		flex: 100,
		valueFormatter: (params) => {
			if (params.value == null) {
				return "";
			}

			const valueFormatted = Number(params.value).toFixed(0).toLocaleString();
			return `${valueFormatted}`;
		},
	},
	{
		field: "Score",
		headerName: "Score",
		type: "number",
		width: 100,
		valueFormatter: (params) => {
			if (params.value == null) {
				return "";
			}

			const valueFormatted = Number(params.value).toFixed(0).toLocaleString();
			return `${valueFormatted}%`;
		},
	},
	{ field: "itemVelocity", type: "number", headerName: "Velocity", flex: 100 },
	{
		field: "itemVelocityScore",
		type: "number",
		headerName: "Velocity%",
		flex: 100,
		valueFormatter: (params) => {
			if (params.value == null) {
				return "";
			}

			const valueFormatted = Number(params.value).toFixed(0).toLocaleString();
			return `${valueFormatted}%`;
		},
	},

	{
		field: "stDev",
		type: "number",
		headerName: "Deviation",
		flex: 100,
		valueFormatter: (params) => {
			if (params.value == null) {
				return "";
			}

			const valueFormatted = Number(params.value).toFixed(0).toLocaleString();
			return `${valueFormatted}%`;
		},
	},
	{
		field: "stDevScore",
		type: "number",
		headerName: "Deviation%",
		flex: 100,
		valueFormatter: (params) => {
			if (params.value == null) {
				return "";
			}

			const valueFormatted = Number(params.value).toFixed(0).toLocaleString();
			return `${valueFormatted}%`;
		},
	},

	{ field: "itemValue", type: "number", headerName: "Ratio", flex: 100 },
	{
		field: "itemValueScore",
		type: "number",
		headerName: "Ratio%",
		flex: 100,
		valueFormatter: (params) => {
			if (params.value == null) {
				return "";
			}

			const valueFormatted = Number(params.value).toFixed(0).toLocaleString();
			return `${valueFormatted}%`;
		},
	},
	{ field: "numListings", type: "number", headerName: "Listings", flex: 100 },
	{
		field: "numListingsScore",
		type: "number",
		headerName: "Listings%",
		flex: 100,
		valueFormatter: (params) => {
			if (params.value == null) {
				return "";
			}

			const valueFormatted = Number(params.value).toFixed(0).toLocaleString();
			return `${valueFormatted}%`;
		},
	},
];

export default function DataTable(props) {
	const handleGetRowId = (e) => {
		return e.itemId;
	};
	return (
		<div style={{ width: "100%" }}>
			{
				<DataGrid
					rows={props.data}
					columns={columns}
					getRowId={handleGetRowId}
					autoHeight={true}
					pageSize={10}
					rowsPerPageOptions={[10]}
					hideFooterSelectedRowCount={true}
					loading={props.loading}
				/>
			}
		</div>
	);
}
