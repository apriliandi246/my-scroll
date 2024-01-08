"use strict";

import store from "./store.js";

class Slide {
	#slideElements;
	#slidesContainer;
	#slideTypeDataAttr;
	#CSSPixelMobileSize;
	#transitionDelayCSSVariable;

	constructor() {
		this.slideTransitionDuration;
		this.#CSSPixelMobileSize = 768;

		this.#slideTypeDataAttr = "data-mys-multiscroll-slide-type";
		this.#transitionDelayCSSVariable = "--mys-multiscroll-slide-transition-duration";
		this.#slidesContainer = document.getElementById("mys-multiscroll-slide-container");

		this.#slideElements = this.#slidesContainer.children;
		this.totalSlideElements = this.#slideElements.length;

		this.#run();
	}

	#run() {
		this.#setSlideTransitionDuration();
		this.#setSlidesAttributesWhileResizing();
		this.#setSlidesAttributesOnMobileView();
	}

	#setSlideTransitionDuration() {
		const computedStyle = getComputedStyle(this.#slidesContainer);
		const transitionSlideTimeCSSValue = computedStyle.getPropertyValue(this.#transitionDelayCSSVariable);
		const transitionSlideTimeInt = parseInt(transitionSlideTimeCSSValue);

		this.slideTransitionDuration = transitionSlideTimeInt;
	}

	#setSlidesAttributesOnMobileView() {
		if (this.isDekstopView() === true) return;

		const { currentActiveSlideNumber } = store.getState();

		const currentActiveSlideElement = this.#slideElements[currentActiveSlideNumber];
		currentActiveSlideElement.style.removeProperty("z-index");

		for (let slideIdx = 0; slideIdx < this.totalSlideElements; slideIdx++) {
			const slideElement = this.#slideElements[slideIdx];
			slideElement.removeAttribute("aria-hidden");
		}
	}

	#setSlidesAttributesWhileResizing() {
		const resizeEventHandler = () => {
			const { currentActiveSlideNumber } = store.getState();
			const currentActiveSlideElement = this.#slideElements[currentActiveSlideNumber];

			if (this.isDekstopView() === true) {
				currentActiveSlideElement.style.setProperty("z-index", "1");

				for (let slideIdx = 0; slideIdx < this.totalSlideElements; slideIdx++) {
					const slideElement = this.#slideElements[slideIdx];

					if (currentActiveSlideNumber === slideIdx) {
						slideElement.setAttribute("aria-hidden", "false");
					}

					if (currentActiveSlideNumber !== slideIdx) {
						slideElement.setAttribute("aria-hidden", "true");
					}
				}
			}

			if (this.isDekstopView() === false) {
				currentActiveSlideElement.style.removeProperty("z-index");

				for (let slideIdx = 0; slideIdx < this.totalSlideElements; slideIdx++) {
					const slideElement = this.#slideElements[slideIdx];
					slideElement.removeAttribute("aria-hidden");
				}
			}
		};

		window.addEventListener("resize", this.#debounce(resizeEventHandler, 300));
	}

	#debounce(func, delay) {
		let timer;

		return function (...args) {
			clearTimeout(timer);

			timer = setTimeout(() => {
				func.apply(this, args);
			}, delay);
		};
	}

	oneTimeSlidingSlide(direction) {
		const { getState, setState } = store;

		setState({
			type: "SLIDING-PROCESS",
			values: {
				isSlideNavigating: true,
			},
		});

		for (let slideIdx = 0; slideIdx < this.totalSlideElements; slideIdx++) {
			const slideElement = this.#slideElements[slideIdx];
			const slideElementType = slideElement.getAttribute(this.#slideTypeDataAttr);

			const firstSlideElement = slideElement.firstElementChild;
			const firstSlideElTransformValue = firstSlideElement.style.getPropertyValue("transform");
			const firstSlideElTranslatePosition = firstSlideElTransformValue.match(/translate3d\((0|0px), (\d+|-\d+)%, (0|0px)\)/);
			const firstSlideElTranslateYPosition = parseInt(firstSlideElTranslatePosition[2]);

			if (slideElementType === "full") {
				if (direction === "top") {
					const slideTranslateYPosition = firstSlideElTranslateYPosition + 100;
					firstSlideElement.style.setProperty("transform", `translate3d(0, ${slideTranslateYPosition}%), 0`);
				}

				if (direction === "bottom") {
					const slideTranslateYPosition = firstSlideElTranslateYPosition - 100;
					firstSlideElement.style.setProperty("transform", `translate3d(0, ${slideTranslateYPosition}%), 0`);
				}
			}

			if (slideElementType === "multi") {
				const secondSlideElement = slideElement.lastElementChild;
				const secondSlideElTransformValue = secondSlideElement.style.getPropertyValue("transform");
				const secondSlideElTranslatePosition = secondSlideElTransformValue.match(/translate3d\((0|0px), (\d+|-\d+)%, (0|0px)\)/);
				const secondSlideElTranslateYPosition = parseInt(secondSlideElTranslatePosition[2]);

				if (direction === "top") {
					const firstSlideTranslateYPosition = firstSlideElTranslateYPosition + 100;
					const secondSlideTranslateYPosition = secondSlideElTranslateYPosition - 100;

					firstSlideElement.style.setProperty("transform", `translate3d(0, ${firstSlideTranslateYPosition}%, 0)`);
					secondSlideElement.style.setProperty("transform", `translate3d(0, ${secondSlideTranslateYPosition}%, 0)`);
				}

				if (direction === "bottom") {
					const firstSlideTranslateYPosition = firstSlideElTranslateYPosition - 100;
					const secondSlideTranslateYPosition = secondSlideElTranslateYPosition + 100;

					firstSlideElement.style.setProperty("transform", `translate3d(0, ${firstSlideTranslateYPosition}%, 0)`);
					secondSlideElement.style.setProperty("transform", `translate3d(0, ${secondSlideTranslateYPosition}%, 0)`);
				}
			}
		}

		this.#slideElements[getState().currentActiveSlideNumber].style.removeProperty("z-index");
		this.#slideElements[getState().currentActiveSlideNumber].setAttribute("aria-hidden", "true");

		if (direction === "top") {
			const previosSlideElement = this.#slideElements[getState().currentActiveSlideNumber].previousElementSibling;
			previosSlideElement.setAttribute("aria-hidden", "false");

			setState({
				type: "ACTIVE-SLIDE",
				values: {
					currentActiveSlideNumber: getState().currentActiveSlideNumber - 1,
				},
			});
		}

		if (direction === "bottom") {
			const nextSlideElement = this.#slideElements[getState().currentActiveSlideNumber].nextElementSibling;
			nextSlideElement.setAttribute("aria-hidden", "false");

			setState({
				type: "ACTIVE-SLIDE",
				values: {
					currentActiveSlideNumber: getState().currentActiveSlideNumber + 1,
				},
			});
		}

		/*
			🕵️‍♂️
		*/
		this.#slideElements[getState().currentActiveSlideNumber].style.setProperty("z-index", "1");

		setState({
			type: "SLIDING-PROCESS",
			values: {
				isSlideNavigating: false,
			},
		});
	}

	multipleTimeSlidingSlide(direction, slideComparison, choosenSlideNumber) {
		const { getState, setState } = store;

		setState({
			type: "SLIDING-PROCESS",
			values: {
				isSlideNavigating: true,
			},
		});

		this.#slideElements[getState().currentActiveSlideNumber].style.removeProperty("z-index");

		for (let ii = 0; ii < slideComparison; ii++) {
			for (let slideIdx = 0; slideIdx < this.totalSlideElements; slideIdx++) {
				const slideElement = this.#slideElements[slideIdx];
				const slideElementype = slideElement.getAttribute(this.#slideTypeDataAttr);

				const firstSlideElement = slideElement.firstElementChild;
				const firstSlideElTransformValue = firstSlideElement.style.getPropertyValue("transform");
				const firstSlideElTranslatePosition = firstSlideElTransformValue.match(/translate3d\((0|0px), (\d+|-\d+)%, (0|0px)\)/);
				const firstSlideElTranslateYPosition = parseInt(firstSlideElTranslatePosition[2]);

				if (slideElementype === "full") {
					if (direction === "top") {
						const slideTranslateYPosition = firstSlideElTranslateYPosition + 100;

						firstSlideElement.style.setProperty("transform", `translate3d(0, ${slideTranslateYPosition}%, 0)`);
					}

					if (direction === "bottom") {
						const slideTranslateYPosition = firstSlideElTranslateYPosition - 100;

						firstSlideElement.style.setProperty("transform", `translate3d(0, ${slideTranslateYPosition}%, 0)`);
					}
				}

				if (slideElementype === "multi") {
					const secondSlideElement = slideElement.lastElementChild;
					const secondSlideElTransformValue = secondSlideElement.style.getPropertyValue("transform");
					const secondSlideElTranslatePosition = secondSlideElTransformValue.match(/translate3d\((0|0px), (\d+|-\d+)%, (0|0px)\)/);
					const secondSlideElTranslateYPosition = parseInt(secondSlideElTranslatePosition[2]);

					if (direction === "top") {
						const firstSlideTranslateYPosition = firstSlideElTranslateYPosition + 100;
						const secondSlideTranslateYPosition = secondSlideElTranslateYPosition - 100;

						firstSlideElement.style.setProperty("transform", `translate3d(0, ${firstSlideTranslateYPosition}%, 0)`);
						secondSlideElement.style.setProperty("transform", `translate3d(0, ${secondSlideTranslateYPosition}%, 0)`);
					}

					if (direction === "bottom") {
						const firstSlideTranslateYPosition = firstSlideElTranslateYPosition - 100;
						const secondSlideTranslateYPosition = secondSlideElTranslateYPosition + 100;

						firstSlideElement.style.setProperty("transform", `translate3d(0, ${firstSlideTranslateYPosition}%, 0)`);
						secondSlideElement.style.setProperty("transform", `translate3d(0, ${secondSlideTranslateYPosition}%, 0)`);
					}
				}

				if (getState().currentActiveSlideNumber !== choosenSlideNumber) {
					this.#slideElements[choosenSlideNumber].setAttribute("aria-hidden", "false");
					this.#slideElements[getState().currentActiveSlideNumber].setAttribute("aria-hidden", "true");
				}

				setState({
					type: "ACTIVE-SLIDE",
					values: {
						currentActiveSlideNumber: choosenSlideNumber,
					},
				});

				/*
					🕵️‍♂️
				*/
				this.#slideElements[getState().currentActiveSlideNumber].style.setProperty("z-index", "1");

				setState({
					type: "SLIDING-PROCESS",
					values: {
						isSlideNavigating: false,
					},
				});
			}
		}
	}

	isDekstopView() {
		const currentViewportWidth = window.innerWidth;

		if (currentViewportWidth > this.#CSSPixelMobileSize) {
			return true;
		} else {
			return false;
		}
	}
}

export default Slide;
