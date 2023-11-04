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
	#slidesContainer;
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

		this.#slidesContainer = document.getElementById("mys-multiscroll-slide-container");
		this.#slideNavBtnElements = document.getElementsByClassName("mys-multiscroll-nav__btn");

		this.#slideElements = this.#slidesContainer.children;
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
		const computedStyle = getComputedStyle(this.#slidesContainer);
		const transitionSlideTime = computedStyle.getPropertyValue(this.#transitionDelayCSSVariable);

		this.#slideTransitionDuration = parseInt(transitionSlideTime);
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

		const debounce = (func, delay) => {
			let timer;

			return function () {
				clearTimeout(timer);

				timer = setTimeout(() => {
					func.apply(this, arguments);
				}, delay);
			};
		};

		window.addEventListener("resize", debounce(resizeEventHandler, 300));
	}

	#navigateSlideKeyboardEvent() {
		const HOME = "Home";
		const END = "End";
		const ARROW_UP = "ArrowUp";
		const ARROW_DOWN = "ArrowDown";
		const PAGE_UP = "PageUp";
		const PAGE_DOWN = "PageDown";

		const waitBtnNavSlide = () => {
			setTimeout(() => {
				this.#isKeyboardEventDelay = false;
			}, this.#slideTransitionDuration);
		};

		const keydownHandler = (event) => {
			if (this.#isDekstopView() === false) return;
			if (this.#isKeyboardEventDelay === true) return;

			const keyboardEventKey = event.key;
			const totalSlideElements = this.#totalSlideElements - 1;

			this.#isKeyboardEventDelay = false;

			if (keyboardEventKey === ARROW_UP || keyboardEventKey === PAGE_UP) {
				if (this.#currentActiveSlideNumber !== 0) {
					this.#unActivatePrevBtnNav();
					this.#oneTimeSlidingSlide("top");
					this.#activateNextBtnNav();

					waitBtnNavSlide();
				}
			}

			if (keyboardEventKey === ARROW_DOWN || keyboardEventKey === PAGE_DOWN) {
				if (this.#currentActiveSlideNumber !== totalSlideElements) {
					this.#unActivatePrevBtnNav();
					this.#oneTimeSlidingSlide("bottom");
					this.#activateNextBtnNav();

					waitBtnNavSlide();
				}
			}

			if (keyboardEventKey === HOME) {
				if (this.#currentActiveSlideNumber !== 0) {
					const slideComparison = Math.abs(this.#currentActiveSlideNumber);

					this.#unActivatePrevBtnNav();
					this.#multipleTimeSlidingSlide("top", slideComparison, 0);
					this.#activateNextBtnNav();

					waitBtnNavSlide();
				}
			}

			if (keyboardEventKey === END) {
				if (this.#currentActiveSlideNumber !== totalSlideElements) {
					const slideComparison = Math.abs(this.#currentActiveSlideNumber - totalSlideElements);

					this.#unActivatePrevBtnNav();
					this.#multipleTimeSlidingSlide("bottom", slideComparison, this.#totalSlideElements - 1);
					this.#activateNextBtnNav();

					waitBtnNavSlide();
				}
			}
		};

		const throttle = (func, delay) => {
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
		};

		document.addEventListener("keydown", throttle(keydownHandler, this.#slideTransitionDuration));
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

				this.#unActivatePrevBtnNav();

				/* 
					If the comparison just one slide 
				*/
				if (slidesComparisonNumber === 1) {
					if (this.#currentActiveSlideNumber - 1 === slideNavNumberInt) {
						this.#oneTimeSlidingSlide("top");
					}

					if (this.#currentActiveSlideNumber + 1 === slideNavNumberInt) {
						this.#oneTimeSlidingSlide("bottom");
					}
				}

				/* 
					If the comparison more than one slides 
				*/
				if (slidesComparisonNumber > 1) {
					if (this.#currentActiveSlideNumber !== 0 && slideNavNumberInt < this.#currentActiveSlideNumber) {
						this.#multipleTimeSlidingSlide("top", slidesComparisonNumber, slideNavNumberInt);
					}

					if (this.#currentActiveSlideNumber !== this.#totalSlideElements - 1 && slideNavNumberInt > this.#currentActiveSlideNumber) {
						this.#multipleTimeSlidingSlide("bottom", slidesComparisonNumber, slideNavNumberInt);
					}
				}

				this.#activateNextBtnNav();
			});
		}
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
			if (this.#isDekstopView() === false) return;
			if (this.isSlideNavigating === true) return;

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
					if (this.#currentActiveSlideNumber !== 0) {
						this.#unActivatePrevBtnNav();
						this.#oneTimeSlidingSlide("top");
						this.#activateNextBtnNav();
					}
				}

				/*
					Scroll to top
						- Swipe to top (for trackpad)
				*/
				if (delta < -DELTA_THRESHOLD) {
					if (this.#currentActiveSlideNumber !== this.#totalSlideElements - 1) {
						this.#unActivatePrevBtnNav();
						this.#oneTimeSlidingSlide("bottom");
						this.#activateNextBtnNav();
					}
				}

				lock(absDelta);

				clearTimeout(wheelLockTimer);

				wheelLockTimer = setTimeout(() => {
					if (wheelPower !== absDelta) return;

					unlock();
				}, this.#slideTransitionDuration);
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

	#activateNextBtnNav() {
		const navBtnActiveElement = this.#slideNavBtnElements[this.#currentActiveSlideNumber];
		navBtnActiveElement.classList.add(this.#slideNavBtnActiveClassname);
	}

	#unActivatePrevBtnNav() {
		const navBtnActiveElement = this.#slideNavBtnElements[this.#currentActiveSlideNumber];
		navBtnActiveElement.classList.remove(this.#slideNavBtnActiveClassname);
	}
}

new Mulstiscroll();
