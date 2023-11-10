class Swipe {
	#slideTransitionDuration;
	#currentActiveSlideNumber;
	#slidesContainer;
	#slideElements;
	#totalSlideElements;
	#transitionDelayCSSVariable;

	constructor() {
		this.#slideTransitionDuration;
		this.#currentActiveSlideNumber = 0;
		this.#transitionDelayCSSVariable = "--mys-swipe-slide-transition-duration";

		this.#slidesContainer = document.getElementById("mys-slides-container");

		this.#slideElements = this.#slidesContainer.children;
		this.#totalSlideElements = this.#slideElements.length;

		this.#run();
	}

	#run() {
		this.#setSlideTransitionDuration();
		this.#navigateSlideSwipeEvent();
	}

	#setSlideTransitionDuration() {
		const computedStyle = getComputedStyle(this.#slidesContainer);
		const transitionSlideTime = computedStyle.getPropertyValue(this.#transitionDelayCSSVariable);

		this.#slideTransitionDuration = parseInt(transitionSlideTime);
	}

	#oneTimeSlidingSlide(direction) {
		for (let i = 0; i < this.#totalSlideElements; i++) {
			const slideElement = this.#slideElements[i];
			const slideElementTransformValue = slideElement.style.getPropertyValue("transform");
			const slideElementTranslateYPosition = parseInt(slideElementTransformValue.replace(/[^-\d.]/g, ""));

			if (direction === "top") {
				const slideTranslateYPosition = slideElementTranslateYPosition + 100;
				slideElement.style.setProperty("transform", `translateY(${slideTranslateYPosition}%)`);
			}

			if (direction === "bottom") {
				const slideTranslateYPosition = slideElementTranslateYPosition - 100;
				slideElement.style.setProperty("transform", `translateY(${slideTranslateYPosition}%)`);
			}
		}

		if (direction === "top") {
			this.#currentActiveSlideNumber -= 1;
		}

		if (direction === "bottom") {
			this.#currentActiveSlideNumber += 1;
		}
	}

	#navigateSlideSwipeEvent() {
		let clientYStart = 0;
		let swipeTopLimit = 0;
		let swipeBottomlLimit = 0;

		let swipeInteractTop = 0;

		document.addEventListener("touchstart", (event) => {
			clientYStart = event.changedTouches[0].clientY;
		});

		document.addEventListener("touchend", (event) => {
			const clientYEnd = event.changedTouches[0].clientY;
			const isSwipeToTop = clientYStart > clientYEnd ? true : false;

			/*
				Swipe to top
			*/
			if (isSwipeToTop === true) {
				if (this.#currentActiveSlideNumber !== this.#totalSlideElements - 1) {
					this.#oneTimeSlidingSlide("bottom");

					this.#slidesContainer.style.setProperty("transform", "translateY(0)");
					swipeTopLimit = 0;
				} else {
					this.#slidesContainer.style.setProperty("transform", "translateY(0)");
					swipeTopLimit = 0;
				}
			}

			/*
				Swipe to bottom
			*/
			if (isSwipeToTop === false) {
				if (this.#currentActiveSlideNumber !== 0) {
					this.#oneTimeSlidingSlide("top");

					this.#slidesContainer.style.setProperty("transform", "translateY(0)");
					swipeBottomlLimit = 0;
				} else {
					this.#slidesContainer.style.setProperty("transform", "translateY(0)");
					swipeBottomlLimit = 0;
				}
			}
		});

		/*
			Make the slide little bit move when at the first and the last slide
		*/
		document.addEventListener("touchmove", (event) => {
			const clientYMove = event.changedTouches[0].clientY;

			if (clientYStart > clientYMove) {
				swipeInteractTop += 1;
			}

			if (clientYStart < clientYMove && this.#currentActiveSlideNumber === 0) {
				if (swipeBottomlLimit < 10) {
					swipeBottomlLimit += 1;
					this.#slidesContainer.style.setProperty("transform", `translateY(${swipeBottomlLimit}%)`);
				}
			}

			if (clientYStart > clientYMove && this.#currentActiveSlideNumber === this.#totalSlideElements - 1) {
				if (swipeTopLimit < 10) {
					swipeTopLimit += 1;
					this.#slidesContainer.style.setProperty("transform", `translateY(${-swipeTopLimit}%)`);
				}
			}
		});
	}
}

new Swipe();
