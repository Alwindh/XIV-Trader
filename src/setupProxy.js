const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
	app.use(
		createProxyMiddleware("/api", {
			// <-- notice the pattern is not in use but in the proxy method
			target: "http://localhost:6080",
			changeOrigin: true,
		})
	);
};
