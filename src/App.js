import "./App.css";
import UnionComp from "./components/union.comp";
import FlippingComp from "./components/flipping.comp";
import MountsComp from "./components/mounts.comp";
import Container from "@mui/material/Container";

function App() {
	return (
		<Container>
			<FlippingComp />
			<UnionComp />
			<MountsComp />
		</Container>
	);
}

export default App;
