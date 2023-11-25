const config = {
	verbose: true,
	collectCoverage: true,
	testEnvironment: "jsdom",
	testPathIgnorePatterns: ["/node_modules/", "/scroll-swipe/test/utils"],
	coveragePathIgnorePatterns: ["/scroll-swipe/test/utils", "/scroll-swipe/dekstop/multiscroll/javascript/store.js"],
};

export default config;
