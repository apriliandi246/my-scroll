const config = {
	verbose: true,
	collectCoverage: true,
	testEnvironment: "jsdom",
	testPathIgnorePatterns: ["/node_modules/", "/my-scroll/__test__/helpers/"],
	coveragePathIgnorePatterns: ["/my-scroll/__test__/helpers/", "/my-scroll/packages/js/store.js"],
};

export default config;
