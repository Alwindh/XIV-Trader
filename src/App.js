import "./App.css";
import UnionComp from "./components/union.comp";
import FlippingComp from "./components/flipping.comp";
import MountsComp from "./components/mounts.comp";
import Container from "@mui/material/Container";
import Footer from "./components/footer.comp";
import AppBar from "./components/appbar.comp";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

const darkTheme = createTheme({
	palette: {
		mode: "dark",
	},
});

function App() {
	return (
		<ThemeProvider theme={darkTheme}>
			<CssBaseline enableColorScheme />
			<AppBar />
			<div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 64px)" }}>
				<Container style={{ paddingTop: "1em", flex: "1 0 auto", top: "0px" }}>
					<FlippingComp />
					<MountsComp />
					<UnionComp />
				</Container>
				<Footer />
			</div>
		</ThemeProvider>
	);
}

export default App;
