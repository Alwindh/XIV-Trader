const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
	app.use(
		createProxyMiddleware("/api", {
			// <-- notice the pattern is not in use but in the proxy method
			target: "https://xiv.alwin.gg",
			changeOrigin: true,
		})
	);
};
