"use strict";

import store from "./store.js";

class ButtonNavigation {
	#slideNavBtnElements;
	#totalSlideNavBtnElements;
	#slideNavBtnNumberDataAttr;
	#slideNavBtnActiveClassname;

	#slide;

	constructor(slide) {
		this.#slideNavBtnNumberDataAttr = "data-mys-multiscroll-nav";
		this.#slideNavBtnActiveClassname = "mys-multiscroll-nav__btn--active";
		this.#slideNavBtnElements = document.getElementsByClassName("mys-multiscroll-nav__btn");
		this.#totalSlideNavBtnElements = this.#slideNavBtnElements.length;

		this.#slide = slide;

		this.#run();
	}

	#run() {
		this.#navigateSlideNavButtons();
	}

	#navigateSlideNavButtons() {
		if (this.#slideNavBtnElements.length === 0) return;

		for (let btnIdx = 0; btnIdx < this.#totalSlideNavBtnElements; btnIdx++) {
			const navBtnElement = this.#slideNavBtnElements[btnIdx];

			navBtnElement.addEventListener("click", () => {
				if (this.#slide.isDekstopView() === false) return;

				const { isSlideNavigating, currentActiveSlideNumber } = store.getState();

				if (isSlideNavigating === true) return;

				const slideNavNumber = navBtnElement.getAttribute(this.#slideNavBtnNumberDataAttr);
				const slideNavNumberInt = parseInt(slideNavNumber);
				const slidesComparisonNumber = Math.abs(currentActiveSlideNumber - slideNavNumberInt);

				this.setUnActivePrevBtnNav();

				/* 
					If the comparison just one slide 
				*/
				if (slidesComparisonNumber === 1) {
					if (currentActiveSlideNumber - 1 === slideNavNumberInt) {
						this.#slide.oneTimeSlidingSlide("top");
					}

					if (currentActiveSlideNumber + 1 === slideNavNumberInt) {
						this.#slide.oneTimeSlidingSlide("bottom");
					}
				}

				/* 
					If the comparison more than one slides 
				*/
				if (slidesComparisonNumber > 1) {
					if (currentActiveSlideNumber !== 0 && slideNavNumberInt < currentActiveSlideNumber) {
						this.#slide.multipleTimeSlidingSlide("top", slidesComparisonNumber, slideNavNumberInt);
					}

					if (currentActiveSlideNumber !== this.#slide.totalSlideElements - 1 && slideNavNumberInt > store.getState().currentActiveSlideNumber) {
						this.#slide.multipleTimeSlidingSlide("bottom", slidesComparisonNumber, slideNavNumberInt);
					}
				}

				this.setActiveNextBtnNav();
			});
		}
	}

	setActiveNextBtnNav() {
		if (this.#slideNavBtnElements.length === 0) return;

		const currentActiveSlideNumber = store.getState().currentActiveSlideNumber;
		const navBtnActiveElement = this.#slideNavBtnElements[currentActiveSlideNumber];

		navBtnActiveElement.classList.add(this.#slideNavBtnActiveClassname);
	}

	setUnActivePrevBtnNav() {
		if (this.#slideNavBtnElements.length === 0) return;

		const currentActiveSlideNumber = store.getState().currentActiveSlideNumber;
		const navBtnActiveElement = this.#slideNavBtnElements[currentActiveSlideNumber];

		navBtnActiveElement.classList.remove(this.#slideNavBtnActiveClassname);
	}
}

export default ButtonNavigation;
