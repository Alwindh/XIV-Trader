import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export default function BasicTable(props) {
	const rows = props.data;
	return (
		<TableContainer component={Paper}>
			<Table sx={{ minWidth: 650 }} aria-label="simple table">
				<TableHead>
					<TableRow>
						<TableCell>Item name</TableCell>
						<TableCell align="right">Union Cost</TableCell>
						<TableCell align="right">Gil Price</TableCell>
						<TableCell align="right">stDev</TableCell>
						<TableCell align="right">Value</TableCell>
						<TableCell align="right">Volume</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{rows.map((row) => (
						<TableRow key={row.name} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
							<TableCell component="th" scope="row">
								{row.itemName}
							</TableCell>
							<TableCell align="right">{row.itemCost}</TableCell>
							<TableCell align="right">{row.itemGilValue.toFixed(2)}</TableCell>
							<TableCell align="right">{row.stDev.toFixed(2)}%</TableCell>
							<TableCell align="right">{row.itemValue.toFixed(2)}</TableCell>
							<TableCell align="right">{row.itemVelocity.toFixed(2)}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}
