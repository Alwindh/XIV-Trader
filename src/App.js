import "./App.css";
import UnionComp from "./components/union.comp";
import FlippingComp from "./components/flipping.comp";
import MountsComp from "./components/mounts.comp";
import Container from "@mui/material/Container";
import CandleStick from "./components/candleStick.comp";

function App() {
	return (
		<Container style={{ marginTop: "1em" }}>
			<CandleStick />
			<FlippingComp />
			<UnionComp />
			<MountsComp />
		</Container>
	);
}

export default App;
