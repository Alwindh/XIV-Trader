import "./App.css";
import UnionComp from "./components/union.comp";
import FlippingComp from "./components/flipping.comp";
import MountsComp from "./components/mounts.comp";
import Container from "@mui/material/Container";
import Footer from "./components/footer.comp";
import AppBar from "./components/appbar.comp";

function App() {
	return (
		<>
			<AppBar />
			<div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 64px)" }}>
				<Container style={{ paddingTop: "1em", flex: "1 0 auto", top: "0px" }}>
					<FlippingComp />
					<MountsComp />
					<UnionComp />
				</Container>
				<Footer />
			</div>
		</>
	);
}

export default App;
