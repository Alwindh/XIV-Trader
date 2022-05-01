import "./App.css";
import UnionComp from "./components/union.comp";
import FlippingComp from "./components/flipping.comp";
import MountsComp from "./components/mounts.comp";
import Container from "@mui/material/Container";

function App() {
	return (
		<Container style={{ marginTop: "1em" }}>
			<FlippingComp />
			<MountsComp />
			<UnionComp />
		</Container>
	);
}

export default App;
