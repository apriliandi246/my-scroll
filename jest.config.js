const config = {
	verbose: true,
	collectCoverage: true,
	testEnvironment: "jsdom",
	testPathIgnorePatterns: ["/node_modules/", "/scroll-swipe/dekstop/multiscroll/test/helpers"],
	coveragePathIgnorePatterns: ["/scroll-swipe/dekstop/multiscroll/test/helpers", "/scroll-swipe/dekstop/multiscroll/packages/javascript/store.js"],
};

export default config;
