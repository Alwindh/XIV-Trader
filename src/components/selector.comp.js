import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function BasicSelect(props) {
	return (
		<Box sx={{ minWidth: 120, padding: 1 }}>
			<FormControl fullWidth disabled={props.disabled}>
				<InputLabel id={`${props.name}-selector-label`}>{props.name}</InputLabel>
				<Select
					labelId={`${props.name} Selector`}
					id={`${props.name}-selector`}
					value={props.value}
					label={props.name}
					onChange={props.handleChange}
					name={props.name}
				>
					{props.disabled === false && props.options
						? props.options.map((option) => {
								return (
									<MenuItem key={option.optionValue} value={option.optionValue}>
										{option.optionName}
									</MenuItem>
								);
						  })
						: ""}
				</Select>
			</FormControl>
		</Box>
	);
}
