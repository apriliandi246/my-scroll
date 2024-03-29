import store from "../../packages/js/store.js";

function setupStore() {
	store.setState({
		type: "SLIDING-PROCESS",
		values: {
			isSlideNavigating: false,
		},
	});

	store.setState({
		type: "ACTIVE-SLIDE",
		values: {
			currentActiveSlideNumber: 0,
		},
	});
}

export default setupStore;
