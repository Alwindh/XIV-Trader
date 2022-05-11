import "./App.css";
import UnionComp from "./components/union.comp";
import FlippingComp from "./components/flipping.comp";
import MountsComp from "./components/mounts.comp";
import Container from "@mui/material/Container";
import Footer from "./components/footer.comp";

function App() {
	return (
		<div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
			<Container style={{ paddingTop: "1em", flex: "1 0 auto" }}>
				<FlippingComp />
				<MountsComp />
				<UnionComp />
				<div style={{ height: "25px" }} />
			</Container>
			<Footer />
		</div>
	);
}

export default App;
