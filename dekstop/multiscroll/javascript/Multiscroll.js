"use strict";

import Slide from "./Slide.js";
import WheelScrollNavigation from "./WheelScrollNavigation.js";
import KeyboardNavigation from "./KeyboardNavigation.js";
import ButtonNavigation from "./ButtonNavigation.js";

class Mulstiscroll {
	constructor() {
		this.#main();
	}

	#main() {
		const slide = new Slide();
		const buttonNavigation = new ButtonNavigation(slide);

		new KeyboardNavigation(slide, buttonNavigation);
		new WheelScrollNavigation(slide, buttonNavigation);
	}
}

new Mulstiscroll();
