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
		this.#isKeyboardEventDelay = false;
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

		this.#run();
	}

	#run() {
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
		const transitionTime = parseInt(computedStyle.getPropertyValue(this.#transitionDelayCSSVariable));

		this.#slideTransitionDuration = transitionTime;
	}

	#setSlidesAriaHiddenMobileView() {
		if (this.#isDekstopView() === true) return;

		const currentActiveSlideElement = this.#slideElements[this.#currentActiveSlideNumber];
		currentActiveSlideElement.style.removeProperty("z-index");

		for (let i = 0; i < this.#totalSlideElements; i++) {
			const slideElement = this.#slideElements[i];
			slideElement.removeAttribute("aria-hidden");
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
			const currentActiveSlideElement = this.#slideElements[this.#currentActiveSlideNumber];

			if (this.#isDekstopView() === true) {
				window.scrollTo({ top: 0 });
				currentActiveSlideElement.style.setProperty("z-index", "1");

				for (let i = 0; i < this.#totalSlideElements; i++) {
					const slideElement = this.#slideElements[i];

					if (this.#currentActiveSlideNumber === i) {
						slideElement.setAttribute("aria-hidden", "false");
					}

					if (this.#currentActiveSlideNumber !== i) {
						slideElement.setAttribute("aria-hidden", "true");
					}
				}
			}

			if (this.#isDekstopView() === false) {
				currentActiveSlideElement.style.removeProperty("z-index");

				for (let i = 0; i < this.#totalSlideElements; i++) {
					const slideElement = this.#slideElements[i];
					slideElement.removeAttribute("aria-hidden");
				}
			}
		};

		window.addEventListener("resize", debounce(resizeEventHandler, 300));
	}

	#navigateSlideKeyboardEvent() {
		const keydownHandler = (event) => {
			if (this.#isDekstopView() === false) return;
			if (this.#isKeyboardEventDelay === true) return;

			const keyboardEventKey = event.key.toLowerCase();
			const totalSlideElements = this.#totalSlideElements - 1;

			this.#isKeyboardEventDelay = false;
			this.#slideNavBtnElements[this.#currentActiveSlideNumber].classList.remove(this.#slideNavBtnActiveClassname);

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

			if (keyboardEventKey === "home") {
				if (this.#currentActiveSlideNumber !== 0) {
					const slideComparison = Math.abs(totalSlideElements);
					this.#multipleTimeSlidingSlide("top", slideComparison, 1);
				}
			}

			if (keyboardEventKey === "end") {
				if (this.#currentActiveSlideNumber !== totalSlideElements) {
					const slideComparison = Math.abs(this.#currentActiveSlideNumber - totalSlideElements);
					this.#multipleTimeSlidingSlide("bottom", slideComparison, this.#totalSlideElements);
				}
			}

			this.#slideNavBtnElements[this.#currentActiveSlideNumber].classList.add(this.#slideNavBtnActiveClassname);

			setTimeout(() => {
				this.#isKeyboardEventDelay = false;
			}, this.#slideTransitionDuration);
		};

		document.addEventListener("keydown", keydownHandler);
	}

	#navigateSlideNavButtons() {
		for (let i = 0; i < this.#totalSlideNavBtnElements; i++) {
			const navBtnElement = this.#slideNavBtnElements[i];

			navBtnElement.addEventListener("click", () => {
				if (this.#isDekstopView() === false) return;
				if (this.#isSlideNavigating === true) return;

				const slideNavNumber = navBtnElement.getAttribute(this.#slideNavBtnNumberDataAttr);
				const slideNavNumberInt = parseInt(slideNavNumber);
				const slidesComparisonNumber = Math.abs(this.#currentActiveSlideNumber - slideNavNumberInt);

				this.#slideNavBtnElements[this.#currentActiveSlideNumber].classList.remove(this.#slideNavBtnActiveClassname);

				// if the comparison just one slide
				if (slidesComparisonNumber === 1) {
					if (this.#currentActiveSlideNumber - 1 === slideNavNumberInt) {
						this.#oneTimeSlidingSlide("top");
					}

					if (this.#currentActiveSlideNumber + 1 === slideNavNumberInt) {
						this.#oneTimeSlidingSlide("bottom");
					}
				}

				// if the comparison more than one slides
				if (slidesComparisonNumber > 1) {
					if (this.#currentActiveSlideNumber !== 0 && slideNavNumberInt < this.#currentActiveSlideNumber) {
						this.#multipleTimeSlidingSlide("top", slidesComparisonNumber, slideNavNumberInt);
					}

					if (this.#currentActiveSlideNumber !== this.#totalSlideElements - 1 && slideNavNumberInt > this.#currentActiveSlideNumber) {
						this.#multipleTimeSlidingSlide("bottom", slidesComparisonNumber, slideNavNumberInt);
					}
				}

				this.#slideNavBtnElements[this.#currentActiveSlideNumber].classList.add(this.#slideNavBtnActiveClassname);
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
			if (this.#isDekstopView() === false) return;
			if (this.#isSlideNavigating === true) return;
			if (Math.abs(event.deltaY) === 0) return;

			const totalSlideElements = this.#totalSlideElements - 1;
			const isWheelToBottom = Math.sign(event.deltaY) === 1 ? true : false;

			this.#slideNavBtnElements[this.#currentActiveSlideNumber].classList.remove(this.#slideNavBtnActiveClassname);

			if (isWheelToBottom === false) {
				if (this.#currentActiveSlideNumber !== 0) {
					this.#oneTimeSlidingSlide("top");
				}
			}

			if (isWheelToBottom === true) {
				if (this.#currentActiveSlideNumber !== totalSlideElements) {
					this.#oneTimeSlidingSlide("bottom");
				}
			}

			this.#slideNavBtnElements[this.#currentActiveSlideNumber].classList.add(this.#slideNavBtnActiveClassname);
		};

		document.addEventListener("wheel", throttle(wheelEventHandler, 700), {
			passive: true,
		});
	}

	#oneTimeSlidingSlide(direction) {
		this.#isSlideNavigating = true;

		for (let i = 0; i < this.#totalSlideElements; i++) {
			const slideElement = this.#slideElements[i];
			const slideElementType = slideElement.getAttribute(this.#slideTypeDataAttr);

			const firstSlideElement = slideElement.firstElementChild;
			const firstSlideElTransformValue = firstSlideElement.style.getPropertyValue("transform");
			const firstSlideElTranslateYPosition = parseInt(firstSlideElTransformValue.replace(/[^-\d.]/g, ""));

			if (slideElementType === "full") {
				if (direction === "top") {
					firstSlideElement.style.setProperty("transform", `translateY(${firstSlideElTranslateYPosition + 100}%)`);
				}

				if (direction === "bottom") {
					firstSlideElement.style.setProperty("transform", `translateY(${firstSlideElTranslateYPosition - 100}%)`);
				}
			}

			if (slideElementType === "multi") {
				const secondSlideElement = slideElement.lastElementChild;
				const secondSlideElTransformValue = secondSlideElement.style.getPropertyValue("transform");
				const secondSlideElTranslateYPosition = parseInt(secondSlideElTransformValue.replace(/[^-\d.]/g, ""));

				if (direction === "top") {
					firstSlideElement.style.setProperty("transform", `translateY(${firstSlideElTranslateYPosition + 100}%)`);
					secondSlideElement.style.setProperty("transform", `translateY(${secondSlideElTranslateYPosition - 100}%)`);
				}

				if (direction === "bottom") {
					firstSlideElement.style.setProperty("transform", `translateY(${firstSlideElTranslateYPosition - 100}%)`);
					secondSlideElement.style.setProperty("transform", `translateY(${secondSlideElTranslateYPosition + 100}%)`);
				}
			}
		}

		this.#slideElements[this.#currentActiveSlideNumber].style.removeProperty("z-index");
		this.#slideElements[this.#currentActiveSlideNumber].setAttribute("aria-hidden", "true");

		if (direction === "top") {
			const previosSlideElement = this.#slideElements[this.#currentActiveSlideNumber].previousElementSibling;
			previosSlideElement.setAttribute("aria-hidden", "false");

			this.#currentActiveSlideNumber -= 1;
		}

		if (direction === "bottom") {
			const nextSlideElement = this.#slideElements[this.#currentActiveSlideNumber].nextElementSibling;
			nextSlideElement.setAttribute("aria-hidden", "false");

			this.#currentActiveSlideNumber += 1;
		}

		setTimeout(() => {
			this.#slideElements[this.#currentActiveSlideNumber].style.setProperty("z-index", "1");
			this.#isSlideNavigating = false;
		}, this.#slideTransitionDuration);
	}

	#multipleTimeSlidingSlide(direction, slideComparison, choosenSlideNumber) {
		this.#isSlideNavigating = true;
		this.#slideElements[this.#currentActiveSlideNumber].style.removeProperty("z-index");

		for (let i = 0; i < slideComparison; i++) {
			for (let j = 0; j < this.#totalSlideElements; j++) {
				const slideElement = this.#slideElements[j];
				const slideElementype = slideElement.getAttribute(this.#slideTypeDataAttr);

				const firstSlideElement = slideElement.firstElementChild;
				const firstSlideElTransformValue = firstSlideElement.style.getPropertyValue("transform");
				const firstSlideElTranslateYPosition = parseInt(firstSlideElTransformValue.replace(/[^-\d.]/g, ""));

				if (slideElementype === "full") {
					if (direction === "top") {
						firstSlideElement.style.setProperty("transform", `translateY(${firstSlideElTranslateYPosition + 100}%)`);
					}

					if (direction === "bottom") {
						firstSlideElement.style.setProperty("transform", `translateY(${firstSlideElTranslateYPosition - 100}%)`);
					}
				}

				if (slideElementype === "multi") {
					const secondSlideElement = slideElement.lastElementChild;
					const secondSlideElTransformValue = secondSlideElement.style.getPropertyValue("transform");
					const secondSlideElTranslateYPosition = parseInt(secondSlideElTransformValue.replace(/[^-\d.]/g, ""));

					if (direction === "top") {
						firstSlideElement.style.setProperty("transform", `translateY(${firstSlideElTranslateYPosition + 100}%)`);
						secondSlideElement.style.setProperty("transform", `translateY(${secondSlideElTranslateYPosition - 100}%)`);
					}

					if (direction === "bottom") {
						firstSlideElement.style.setProperty("transform", `translateY(${firstSlideElTranslateYPosition - 100}%)`);
						secondSlideElement.style.setProperty("transform", `translateY(${secondSlideElTranslateYPosition + 100}%)`);
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

	#isDekstopView() {
		const currentViewportWidth = window.innerWidth;

		if (currentViewportWidth > this.#CSSPixelMobileSize) {
			return true;
		} else {
			return false;
		}
	}
}

new Mulstiscroll();
