"use strict";

import store from "./store.js";

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

export default WheelScrollNavigation;
