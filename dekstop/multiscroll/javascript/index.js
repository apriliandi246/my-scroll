class Mulstiscroll {
	#slideTransitionDuration;
	#isSlideNavigating;
	#isKeyboardEventDelay;
	#CSSPixelMobileSize;
	#currentActiveSlideNumber;
	#slideTypeDataAttr;
	#slideNavBtnNumberDataAttr;
	#slideNavBtnActiveClassname;
	#transitionDelayCSSVariable;
	#slideElements;
	#slideNavBtnElements;
	#totalSlideElements;
	#totalSlideNavBtnElements;

	constructor() {
		this.#slideTransitionDuration;
		this.#isSlideNavigating = false;
		this.#isKeyboardEventDelay = true;
		this.#CSSPixelMobileSize = 768;
		this.#currentActiveSlideNumber = 0;
		this.#slideNavBtnNumberDataAttr = "data-mys-multiscroll-nav";
		this.#slideTypeDataAttr = "data-mys-multiscroll-slide-type";
		this.#slideNavBtnActiveClassname = "mys-multiscroll-nav__btn--active";
		this.#transitionDelayCSSVariable = "--mys-multiscroll-slide-transition-duration";
		this.#slideElements = document.getElementsByClassName("mys-multiscroll-slide");
		this.#slideNavBtnElements = document.getElementsByClassName("mys-multiscroll-nav__btn");
		this.#totalSlideElements = this.#slideElements.length;
		this.#totalSlideNavBtnElements = this.#slideNavBtnElements.length;

		this.#main();
	}

	#main() {
		this.#setSlidesAriaHiddenMobileView();
		this.#setSlideTransitionDuration();
		this.#setSlidesAriaHiddenWhileResizing();
		this.#navigateSlideWheelEvent();
		this.#navigateSlideKeyboardEvent();
		this.#navigateSlideNavButtons();
	}

	#setSlideTransitionDuration() {
		const rootHTML = document.documentElement;
		const computedStyle = getComputedStyle(rootHTML);
		const durationTime = parseInt(computedStyle.getPropertyValue(this.#transitionDelayCSSVariable));

		this.#slideTransitionDuration = durationTime;
	}

	#setSlidesAriaHiddenMobileView() {
		const currentViewportWidth = window.innerWidth;

		if (currentViewportWidth < this.#CSSPixelMobileSize) {
			const currentActiveSlideElement = this.#slideElements[this.#currentActiveSlideNumber];
			currentActiveSlideElement.style.removeProperty("z-index");

			for (let index = 0; index < this.#totalSlideElements; index++) {
				const slideElement = this.#slideElements[index];
				slideElement.removeAttribute("aria-hidden");
			}
		}
	}

	#setSlidesAriaHiddenWhileResizing() {
		function debounce(func, delay) {
			let timer;

			return function () {
				clearTimeout(timer);

				timer = setTimeout(() => {
					func.apply(this, arguments);
				}, delay);
			};
		}

		const resizeEventHandler = () => {
			const currentViewportWidth = window.innerWidth;
			const currentActiveSlideElement = this.#slideElements[this.#currentActiveSlideNumber];

			if (currentViewportWidth > this.#CSSPixelMobileSize) {
				window.scrollTo({ top: 0, behavior: "smooth" });
				currentActiveSlideElement.style.setProperty("z-index", "1");

				for (let index = 0; index < this.#totalSlideElements; index++) {
					const slideElement = this.#slideElements[index];

					if (this.#currentActiveSlideNumber === index) {
						slideElement.setAttribute("aria-hidden", "false");
					}

					if (this.#currentActiveSlideNumber !== index) {
						slideElement.setAttribute("aria-hidden", "true");
					}
				}
			}

			if (currentViewportWidth < this.#CSSPixelMobileSize) {
				currentActiveSlideElement.style.removeProperty("z-index");

				for (let index = 0; index < this.#totalSlideElements; index++) {
					const slideElement = this.#slideElements[index];
					slideElement.removeAttribute("aria-hidden");
				}
			}
		};

		window.addEventListener("resize", debounce(resizeEventHandler, 300));
	}

	#oneTimeSlidingSlide(direction) {
		this.#isSlideNavigating = true;

		for (let index = 0; index < this.#totalSlideElements; index++) {
			const slideElement = this.#slideElements[index];
			const slideElementType = slideElement.getAttribute(this.#slideTypeDataAttr);

			if (slideElementType === "multi") {
				const leftSlideElement = slideElement.firstElementChild;
				const leftSlideElTransformValue = leftSlideElement.style.getPropertyValue("transform");
				const leftSlideElTranslateYPosition = parseInt(leftSlideElTransformValue.replace(/[^-\d.]/g, ""));

				const rightSlideElement = slideElement.lastElementChild;
				const rightSlideElTransformValue = rightSlideElement.style.getPropertyValue("transform");
				const rightSlideElTranslateYPosition = parseInt(rightSlideElTransformValue.replace(/[^-\d.]/g, ""));

				if (direction === "bottom") {
					leftSlideElement.style.setProperty("transform", `translateY(${leftSlideElTranslateYPosition - 100}%)`);
					rightSlideElement.style.setProperty("transform", `translateY(${rightSlideElTranslateYPosition + 100}%)`);
				}

				if (direction === "top") {
					leftSlideElement.style.setProperty("transform", `translateY(${leftSlideElTranslateYPosition + 100}%)`);
					rightSlideElement.style.setProperty("transform", `translateY(${rightSlideElTranslateYPosition - 100}%)`);
				}
			}

			if (slideElementType === "full") {
				const fullSlideElement = slideElement.firstElementChild;
				const fullSlideElTransformValue = fullSlideElement.style.getPropertyValue("transform");
				const fullSlideElTranslateYPosition = parseInt(fullSlideElTransformValue.replace(/[^-\d.]/g, ""));

				if (direction === "bottom") {
					fullSlideElement.style.setProperty("transform", `translateY(${fullSlideElTranslateYPosition - 100}%)`);
				}

				if (direction === "top") {
					fullSlideElement.style.setProperty("transform", `translateY(${fullSlideElTranslateYPosition + 100}%)`);
				}
			}
		}

		this.#slideElements[this.#currentActiveSlideNumber].style.removeProperty("z-index");
		this.#slideElements[this.#currentActiveSlideNumber].setAttribute("aria-hidden", "true");

		if (direction === "bottom") {
			const nextSlideElement = this.#slideElements[this.#currentActiveSlideNumber].nextElementSibling;
			nextSlideElement.setAttribute("aria-hidden", "false");

			this.#currentActiveSlideNumber += 1;
		}

		if (direction === "top") {
			const previosSlideElement = this.#slideElements[this.#currentActiveSlideNumber].previousElementSibling;
			previosSlideElement.setAttribute("aria-hidden", "false");

			this.#currentActiveSlideNumber -= 1;
		}

		setTimeout(() => {
			this.#slideElements[this.#currentActiveSlideNumber].style.setProperty("z-index", "1");
			this.#isSlideNavigating = false;
		}, this.#slideTransitionDuration);
	}

	#multipleTimeSlidingSlide(direction, slideComparison, choosenSlideNumber) {
		this.#isSlideNavigating = true;
		this.#slideElements[this.#currentActiveSlideNumber].style.removeProperty("z-index");

		for (let index = 0; index < slideComparison; index++) {
			for (let innerIndex = 0; innerIndex < this.#totalSlideElements; innerIndex++) {
				const slideElement = this.#slideElements[innerIndex];
				const slideElementype = slideElement.getAttribute(this.#slideTypeDataAttr);

				if (slideElementype === "multi") {
					const leftSlideElement = slideElement.firstElementChild;
					const leftSlideElTransformValue = leftSlideElement.style.getPropertyValue("transform");
					const leftSlideElTranslateYPosition = parseInt(leftSlideElTransformValue.replace(/[^-\d.]/g, ""));

					const rightSlideElement = slideElement.lastElementChild;
					const rightSlideElTransformValue = rightSlideElement.style.getPropertyValue("transform");
					const rightSlideElTranslateYPosition = parseInt(rightSlideElTransformValue.replace(/[^-\d.]/g, ""));

					if (direction === "bottom") {
						leftSlideElement.style.setProperty(
							"transform",
							`translateY(${leftSlideElTranslateYPosition - 100}%)`
						);
						rightSlideElement.style.setProperty(
							"transform",
							`translateY(${rightSlideElTranslateYPosition + 100}%)`
						);
					}

					if (direction === "top") {
						leftSlideElement.style.setProperty(
							"transform",
							`translateY(${leftSlideElTranslateYPosition + 100}%)`
						);
						rightSlideElement.style.setProperty(
							"transform",
							`translateY(${rightSlideElTranslateYPosition - 100}%)`
						);
					}
				}

				if (slideElementype === "full") {
					const fullSlideElement = slideElement.firstElementChild;
					const fullSlideElTransformValue = fullSlideElement.style.getPropertyValue("transform");
					const fullSlideElTranslateYPosition = parseInt(fullSlideElTransformValue.replace(/[^-\d.]/g, ""));

					if (direction === "bottom") {
						fullSlideElement.style.setProperty(
							"transform",
							`translateY(${fullSlideElTranslateYPosition - 100}%)`
						);
					}

					if (direction === "top") {
						fullSlideElement.style.setProperty(
							"transform",
							`translateY(${fullSlideElTranslateYPosition + 100}%)`
						);
					}
				}

				this.#slideElements[choosenSlideNumber].setAttribute("aria-hidden", "false");
				this.#slideElements[this.#currentActiveSlideNumber].setAttribute("aria-hidden", "true");

				this.#currentActiveSlideNumber = choosenSlideNumber;

				setTimeout(() => {
					this.#slideElements[this.#currentActiveSlideNumber].style.setProperty("z-index", "1");
					this.#isSlideNavigating = false;
				}, this.#slideTransitionDuration);
			}
		}
	}

	#navigateSlideKeyboardEvent() {
		window.addEventListener("keydown", (event) => {
			const currentViewportWidth = window.innerWidth;

			if (this.#isKeyboardEventDelay === true) {
				if (currentViewportWidth > this.#CSSPixelMobileSize) {
					this.#isKeyboardEventDelay = false;

					const keyboardEventKey = event.key.toLowerCase();
					const totalSlideElements = this.#totalSlideElements - 1;

					this.#slideNavBtnElements[this.#currentActiveSlideNumber].classList.remove(
						this.#slideNavBtnActiveClassname
					);

					if (keyboardEventKey === "end") {
						if (this.#currentActiveSlideNumber !== totalSlideElements) {
							const slideComparison = Math.abs(this.#currentActiveSlideNumber - totalSlideElements);
							this.#multipleTimeSlidingSlide("bottom", slideComparison, this.#totalSlideElements);
						}
					}

					if (keyboardEventKey === "home") {
						if (this.#currentActiveSlideNumber !== 0) {
							const slideComparison = Math.abs(totalSlideElements);
							this.#multipleTimeSlidingSlide("top", slideComparison, 1);
						}
					}

					if (keyboardEventKey === "arrowup" || keyboardEventKey === "pageup") {
						if (this.#currentActiveSlideNumber !== 0) {
							this.#oneTimeSlidingSlide("top");
						}
					}

					if (keyboardEventKey === "arrowdown" || keyboardEventKey === "pagedown") {
						if (this.#currentActiveSlideNumber !== totalSlideElements) {
							this.#oneTimeSlidingSlide("bottom");
						}
					}

					this.#slideNavBtnElements[this.#currentActiveSlideNumber].classList.add(
						this.#slideNavBtnActiveClassname
					);

					setTimeout(() => {
						this.#isKeyboardEventDelay = true;
					}, this.#slideTransitionDuration);
				}
			}
		});
	}

	#navigateSlideNavButtons() {
		for (let index = 0; index < this.#totalSlideNavBtnElements; index++) {
			const navBtnElement = this.#slideNavBtnElements[index];

			navBtnElement.addEventListener("click", () => {
				const currentViewportWidth = window.innerWidth;

				if (this.#isSlideNavigating === false && currentViewportWidth > this.#CSSPixelMobileSize) {
					const slideNavNumber = navBtnElement.getAttribute(this.#slideNavBtnNumberDataAttr);
					const slideNavNumberInt = parseInt(slideNavNumber);
					const slidesComparisonNumber = Math.abs(this.#currentActiveSlideNumber - slideNavNumberInt);

					this.#slideNavBtnElements[this.#currentActiveSlideNumber].classList.remove(
						this.#slideNavBtnActiveClassname
					);

					// if the comparison just one slide
					if (slidesComparisonNumber === 1) {
						if (this.#currentActiveSlideNumber + 1 === slideNavNumberInt) {
							this.#oneTimeSlidingSlide("bottom");
						}

						if (this.#currentActiveSlideNumber - 1 === slideNavNumberInt) {
							this.#oneTimeSlidingSlide("top");
						}
					}

					// if the comparison more than one slides
					if (slidesComparisonNumber > 1) {
						if (
							this.#currentActiveSlideNumber !== this.#totalSlideElements - 1 &&
							slideNavNumberInt > this.#currentActiveSlideNumber
						) {
							this.#multipleTimeSlidingSlide("bottom", slidesComparisonNumber, slideNavNumberInt);
						}

						if (this.#currentActiveSlideNumber !== 0 && slideNavNumberInt < this.#currentActiveSlideNumber) {
							this.#multipleTimeSlidingSlide("top", slidesComparisonNumber, slideNavNumberInt);
						}
					}

					this.#slideNavBtnElements[this.#currentActiveSlideNumber].classList.add(
						this.#slideNavBtnActiveClassname
					);
				}
			});
		}
	}

	#navigateSlideWheelEvent() {
		function throttle(func, delay) {
			let isCanRun = true;

			return function () {
				if (isCanRun === true) {
					func.apply(this, arguments);

					isCanRun = false;

					setTimeout(() => {
						isCanRun = true;
					}, delay);
				}
			};
		}

		const wheelEventHandler = (event) => {
			const currentViewportWidth = window.innerWidth;

			if (this.#isSlideNavigating === false) {
				if (currentViewportWidth > this.#CSSPixelMobileSize) {
					const scrollEventValue = event.deltaY;
					const totalSlideElements = this.#totalSlideElements - 1;

					this.#slideNavBtnElements[this.#currentActiveSlideNumber].classList.remove(
						this.#slideNavBtnActiveClassname
					);

					if (this.#currentActiveSlideNumber !== totalSlideElements && scrollEventValue > 0) {
						this.#oneTimeSlidingSlide("bottom");
					}

					if (this.#currentActiveSlideNumber !== 0 && scrollEventValue < 0) {
						this.#oneTimeSlidingSlide("top");
					}

					this.#slideNavBtnElements[this.#currentActiveSlideNumber].classList.add(
						this.#slideNavBtnActiveClassname
					);
				}
			}
		};

		window.addEventListener("wheel", throttle(wheelEventHandler, 700), {
			passive: true,
		});
	}
}

new Mulstiscroll();
