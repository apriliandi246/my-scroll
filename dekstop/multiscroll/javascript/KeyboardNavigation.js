"use strict";

import store from "./store.js";

class KeyboardNavigation {
	#slide;
	#buttonNavigation;

	constructor(slide, buttonNavigation) {
		this.#slide = slide;
		this.#buttonNavigation = buttonNavigation;

		this.#run();
	}

	#run() {
		this.#navigateSlideKeyboardEvent();
	}

	#navigateSlideKeyboardEvent() {
		const HOME = "Home";
		const END = "End";
		const ARROW_UP = "ArrowUp";
		const ARROW_DOWN = "ArrowDown";
		const PAGE_UP = "PageUp";
		const PAGE_DOWN = "PageDown";

		const keydownHandler = (event) => {
			if (this.#slide.isDekstopView() === false) return;

			const { isSlideNavigating, currentActiveSlideNumber } = store.getState();

			if (isSlideNavigating === true) return;

			const keyboardEventKey = event.key;
			const totalSlideElements = this.#slide.totalSlideElements - 1;

			if (keyboardEventKey === ARROW_UP || keyboardEventKey === PAGE_UP) {
				if (currentActiveSlideNumber !== 0) {
					this.#buttonNavigation.setUnActivePrevBtnNav();
					this.#slide.oneTimeSlidingSlide("top");
					this.#buttonNavigation.setActiveNextBtnNav();
				}
			}

			if (keyboardEventKey === ARROW_DOWN || keyboardEventKey === PAGE_DOWN) {
				if (currentActiveSlideNumber !== totalSlideElements) {
					this.#buttonNavigation.setUnActivePrevBtnNav();
					this.#slide.oneTimeSlidingSlide("bottom");
					this.#buttonNavigation.setActiveNextBtnNav();
				}
			}

			if (keyboardEventKey === HOME) {
				if (currentActiveSlideNumber !== 0) {
					const slideComparison = Math.abs(currentActiveSlideNumber);

					this.#buttonNavigation.setUnActivePrevBtnNav();
					this.#slide.multipleTimeSlidingSlide("top", slideComparison, 0);
					this.#buttonNavigation.setActiveNextBtnNav();
				}
			}

			if (keyboardEventKey === END) {
				if (currentActiveSlideNumber !== totalSlideElements) {
					const slideComparison = Math.abs(currentActiveSlideNumber - totalSlideElements);

					this.#buttonNavigation.setUnActivePrevBtnNav();
					this.#slide.multipleTimeSlidingSlide("bottom", slideComparison, this.#slide.totalSlideElements - 1);
					this.#buttonNavigation.setActiveNextBtnNav();
				}
			}
		};

		document.addEventListener("keydown", this.#throttle(keydownHandler, this.#slide.slideTransitionDuration));
	}

	#throttle(func, delay) {
		let isCanRun = true;

		return function (...args) {
			if (isCanRun === true) {
				func.apply(this, args);

				isCanRun = false;

				setTimeout(() => {
					isCanRun = true;
				}, delay);
			}
		};
	}
}

export default KeyboardNavigation;
