"use strict";

function createStore(mainState, modifier) {
	if (isJustObject(mainState) === false) {
		throw new Error("Just using plain object for the main state");
	}

	if (isObjectEmpty(mainState) === true) {
		throw new Error("Where the hell is your properties of state in your main state object");
	}

	if (typeof modifier !== "function") {
		throw new Error("Just using plain function for the state modifier");
	}

	let isMutating = false;

	function getState() {
		/*
			🕵️‍♂️
		*/
		if (isMutating === true) return;

		return Object.freeze(mainState);
	}

	function setState(payload) {
		/*
			🕵️‍♂️
		*/
		if (isMutating === true) return;

		if (isJustObject(payload) === false) {
			throw new Error("Just using plain object for the payload");
		}

		const nextState = modifier({ ...mainState }, payload);

		if (isJustObject(nextState) === false) {
			throw new Error("Where is the return of object state from your state modifier?");
		}

		mainState = nextState;
	}

	function isJustObject(obj) {
		if (typeof obj !== "object") return false;

		const proto = Object.getPrototypeOf(obj);
		const isPlainObject = proto !== null && Object.getPrototypeOf(proto) === null;

		return isPlainObject;
	}

	function isObjectEmpty(obj) {
		const objProperties = Object.keys(obj);

		if (objProperties.length === 0) {
			return true;
		} else {
			return false;
		}
	}

	return {
		setState,
		getState,
	};
}

const mainState = {
	isSlideNavigating: false,
	currentActiveSlideNumber: 0,
};

function stateModifier(state, payload) {
	const { type, values } = payload;

	if (type === "SLIDING-PROCESS") {
		state.isSlideNavigating = values.isSlideNavigating;
	}

	if (type === "ACTIVE-SLIDE") {
		state.currentActiveSlideNumber = values.currentActiveSlideNumber;
	}

	return state;
}

const store = createStore(mainState, stateModifier);

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
			const firstSlideElTranslateYPosition = parseInt(firstSlideElTransformValue.replace(/[^-\d.]/g, ""));

			if (slideElementType === "full") {
				if (direction === "top") {
					const slideTranslateYPosition = firstSlideElTranslateYPosition + 100;

					firstSlideElement.style.setProperty("transform", `translateY(${slideTranslateYPosition}%)`);
				}

				if (direction === "bottom") {
					const slideTranslateYPosition = firstSlideElTranslateYPosition - 100;

					firstSlideElement.style.setProperty("transform", `translateY(${slideTranslateYPosition}%)`);
				}
			}

			if (slideElementType === "multi") {
				const secondSlideElement = slideElement.lastElementChild;
				const secondSlideElTransformValue = secondSlideElement.style.getPropertyValue("transform");
				const secondSlideElTranslateYPosition = parseInt(secondSlideElTransformValue.replace(/[^-\d.]/g, ""));

				if (direction === "top") {
					const firstSlideTranslateYPosition = firstSlideElTranslateYPosition + 100;
					const secondSlideTranslateYPosition = secondSlideElTranslateYPosition - 100;

					firstSlideElement.style.setProperty("transform", `translateY(${firstSlideTranslateYPosition}%)`);
					secondSlideElement.style.setProperty("transform", `translateY(${secondSlideTranslateYPosition}%)`);
				}

				if (direction === "bottom") {
					const firstSlideTranslateYPosition = firstSlideElTranslateYPosition - 100;
					const secondSlideTranslateYPosition = secondSlideElTranslateYPosition + 100;

					firstSlideElement.style.setProperty("transform", `translateY(${firstSlideTranslateYPosition}%)`);
					secondSlideElement.style.setProperty("transform", `translateY(${secondSlideTranslateYPosition}%)`);
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
				const firstSlideElTranslateYPosition = parseInt(firstSlideElTransformValue.replace(/[^-\d.]/g, ""));

				if (slideElementype === "full") {
					if (direction === "top") {
						const slideTranslateYPosition = firstSlideElTranslateYPosition + 100;

						firstSlideElement.style.setProperty("transform", `translateY(${slideTranslateYPosition}%)`);
					}

					if (direction === "bottom") {
						const slideTranslateYPosition = firstSlideElTranslateYPosition - 100;

						firstSlideElement.style.setProperty("transform", `translateY(${slideTranslateYPosition}%)`);
					}
				}

				if (slideElementype === "multi") {
					const secondSlideElement = slideElement.lastElementChild;
					const secondSlideElTransformValue = secondSlideElement.style.getPropertyValue("transform");
					const secondSlideElTranslateYPosition = parseInt(secondSlideElTransformValue.replace(/[^-\d.]/g, ""));

					if (direction === "top") {
						const firstSlideTranslateYPosition = firstSlideElTranslateYPosition + 100;
						const secondSlideTranslateYPosition = secondSlideElTranslateYPosition - 100;

						firstSlideElement.style.setProperty("transform", `translateY(${firstSlideTranslateYPosition}%)`);
						secondSlideElement.style.setProperty("transform", `translateY(${secondSlideTranslateYPosition}%)`);
					}

					if (direction === "bottom") {
						const firstSlideTranslateYPosition = firstSlideElTranslateYPosition - 100;
						const secondSlideTranslateYPosition = secondSlideElTranslateYPosition + 100;

						firstSlideElement.style.setProperty("transform", `translateY(${firstSlideTranslateYPosition}%)`);
						secondSlideElement.style.setProperty("transform", `translateY(${secondSlideTranslateYPosition}%)`);
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

class ButtonNavigation {
	#slide;
	#slideNavBtnElements;
	#totalSlideNavBtnElements;
	#slideNavBtnNumberDataAttr;
	#slideNavBtnActiveClassname;

	constructor(slide) {
		this.#slide = slide;
		this.#slideNavBtnNumberDataAttr = "data-mys-multiscroll-nav";
		this.#slideNavBtnActiveClassname = "mys-multiscroll-nav__btn--active";
		this.#slideNavBtnElements = document.getElementsByClassName("mys-multiscroll-nav__btn");
		this.#totalSlideNavBtnElements = this.#slideNavBtnElements.length;

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

				if (currentActiveSlideNumber === btnIdx) return;
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

class WheelScrollNavigation {
	#slide;
	#buttonNavigation;

	constructor(slide, buttonNavigation) {
		this.#slide = slide;
		this.#buttonNavigation = buttonNavigation;

		this.#run();
	}

	#run() {
		this.#navigateSlideWheelEvent();
	}

	#navigateSlideWheelEvent() {
		const DELTA_THRESHOLD = 50;
		const NOISE_THRESHOLD = 20;
		const MINIMUM_TIME_STAMP = 300;

		let wheelPower = 0;
		let wheelTimeStamp = 0;
		let isWheelLock = false;
		let wheelLockTimer = null;

		const wheelEventHandler = (event) => {
			if (this.#slide.isDekstopView() === false) return;

			const { isSlideNavigating, currentActiveSlideNumber } = store.getState();

			if (isSlideNavigating === true) return;

			const delta = event.deltaY * -1;
			const absDelta = Math.abs(delta);
			const currentTimeStamp = event.timeStamp;

			if (absDelta < NOISE_THRESHOLD) return;
			if (currentTimeStamp - wheelTimeStamp < MINIMUM_TIME_STAMP && isWheelLock === true) return;

			wheelTimeStamp = currentTimeStamp;

			if (wheelPower < absDelta && isWheelLock === false) {
				/*
					Scroll to top
						- Swipe to bottom (for trackpad)
				*/
				if (delta > DELTA_THRESHOLD) {
					if (currentActiveSlideNumber !== 0) {
						this.#buttonNavigation.setUnActivePrevBtnNav();
						this.#slide.oneTimeSlidingSlide("top");
						this.#buttonNavigation.setActiveNextBtnNav();
					}
				}

				/*
					Scroll to bottom
						- Swipe to top (for trackpad)
				*/
				if (delta < -DELTA_THRESHOLD) {
					if (currentActiveSlideNumber !== this.#slide.totalSlideElements - 1) {
						this.#buttonNavigation.setUnActivePrevBtnNav();
						this.#slide.oneTimeSlidingSlide("bottom");
						this.#buttonNavigation.setActiveNextBtnNav();
					}
				}

				lock(absDelta);

				clearTimeout(wheelLockTimer);

				wheelLockTimer = setTimeout(() => {
					if (wheelPower !== absDelta) return;

					unlock();
				}, this.#slide.slideTransitionDuration);
			}

			if (absDelta < DELTA_THRESHOLD && isWheelLock === true) {
				unlock();
			}

			function lock(absDelta) {
				wheelPower = absDelta;
				isWheelLock = true;
			}

			function unlock() {
				wheelPower = DELTA_THRESHOLD;
				isWheelLock = false;
			}
		};

		document.addEventListener("wheel", wheelEventHandler, {
			passive: true,
		});
	}
}

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
