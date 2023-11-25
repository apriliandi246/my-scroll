import injectCSS from "./injectCSS.js";
import injectHTML from "./injectHTML.js";
import store from "../../dekstop/multiscroll/javascript/store.js";
import Mulstiscroll from "../../dekstop/multiscroll/javascript/Multiscroll.js";

function setup() {
	injectCSS();
	injectHTML();

	new Mulstiscroll();

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

export default setup;
