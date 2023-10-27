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

		this.#testSliding();
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

	#testSliding() {
		const ARROW_UP = "ArrowUp";
		const ARROW_DOWN = "ArrowDown";

		const keydownHandler = (event) => {
			const keyboardEventKey = event.key;

			if (keyboardEventKey === ARROW_UP && this.#currentActiveSlideNumber !== 0) {
				this.#oneTimeSlidingSlide("top");
			}

			if (keyboardEventKey === ARROW_DOWN && this.#currentActiveSlideNumber !== this.#totalSlideElements - 1) {
				this.#oneTimeSlidingSlide("bottom");
			}
		};

		document.addEventListener("keydown", keydownHandler);
	}
}

new Swipe();
