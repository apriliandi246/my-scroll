import { fireEvent, prettyDOM } from "@testing-library/dom";

import store from "../../dekstop/multiscroll/javascript/store.js";
import Multiscroll from "../../dekstop/multiscroll/javascript/Multiscroll.js";

import setupCSS from "../utils/setupCSS.js";
import setupHTML from "../utils/setupHTML.js";
import setupStore from "../utils/setupStore.js";
import isSlideElementHasZindex from "../utils/isSlideElementHasZindex.js";

beforeEach(() => {
	setupCSS();
	setupHTML();
	setupStore();

	jest.useFakeTimers();
});

afterEach(() => {
	jest.useRealTimers();
});

describe("WheelScrollNavigation", () => {
	test("Wheel/scroll to the bottom to go to the next slide", () => {
		new Multiscroll();

		fireEvent.wheel(document, {
			deltaY: 60,
		});

		const nextSlideNumber = 1;
		const nextSlideElement = document.querySelector(".mys-multiscroll-slide:nth-child(2)");
		const activeSlideNumber = store.getState().currentActiveSlideNumber;

		expect(isSlideElementHasZindex(nextSlideElement)).toBe(true);
		expect(activeSlideNumber).toBe(nextSlideNumber);
	});

	test("Wheel navigation will not work if the deltaY value is not face the minimum and the first slide still an active slide", () => {
		new Multiscroll();

		fireEvent.wheel(document, {
			deltaY: 10,
		});

		const firstSlideNumber = 0;
		const firstSlideElement = document.querySelector(".mys-multiscroll-slide:first-child");
		const activeSlideNumber = store.getState().currentActiveSlideNumber;

		expect(isSlideElementHasZindex(firstSlideElement)).toBe(true);
		expect(activeSlideNumber).toBe(firstSlideNumber);
	});

	test("Wheel/scroll to the top to go to the previous slide", () => {
		new Multiscroll();

		fireEvent.wheel(document, {
			deltaY: 60,
		});

		jest.advanceTimersByTime(610);

		fireEvent.wheel(document, {
			deltaY: -60,
		});

		const previousSlideNumber = 0;
		const previousSlideElement = document.querySelector(".mys-multiscroll-slide:first-child");
		const activeSlideNumber = store.getState().currentActiveSlideNumber;

		expect(isSlideElementHasZindex(previousSlideElement)).toBe(true);
		expect(activeSlideNumber).toBe(previousSlideNumber);
	});

	test("Wheel/scroll to the top does not do anything if the first slide is an active slide", () => {
		new Multiscroll();

		fireEvent.wheel(document, {
			deltaY: -60,
		});

		const previousSlideNumber = 0;
		const previousSlideElement = document.querySelector(".mys-multiscroll-slide:first-child");
		const activeSlideNumber = store.getState().currentActiveSlideNumber;

		expect(isSlideElementHasZindex(previousSlideElement)).toBe(true);
		expect(activeSlideNumber).toBe(previousSlideNumber);
	});

	test("Wheel/scroll to bottom for each slide until the last slide", () => {
		new Multiscroll();

		const slideElements = document.getElementsByClassName("mys-multiscroll-slide");
		const lastSlideNumber = slideElements.length - 1;

		for (let slideIdx = 0; slideIdx < lastSlideNumber; slideIdx++) {
			if (slideIdx !== lastSlideNumber - 1) {
				fireEvent.wheel(document, {
					deltaY: 60,
				});

				jest.advanceTimersByTime(610);
			}

			if (slideIdx === lastSlideNumber - 1) {
				fireEvent.wheel(document, {
					deltaY: 60,
				});
			}
		}

		const activeSlideNumber = store.getState().currentActiveSlideNumber;

		expect(isSlideElementHasZindex(slideElements[lastSlideNumber])).toBe(true);
		expect(activeSlideNumber).toBe(lastSlideNumber);
	});

	test("Wheel/scroll to the bottom does not do anything if the last slide is an active slide", () => {
		new Multiscroll();

		const slideElements = document.getElementsByClassName("mys-multiscroll-slide");
		const lastSlideNumber = slideElements.length - 1;

		for (let slideIdx = 0; slideIdx < lastSlideNumber; slideIdx++) {
			fireEvent.wheel(document, {
				deltaY: 60,
			});

			jest.advanceTimersByTime(610);
		}

		fireEvent.wheel(document, {
			deltaY: 60,
		});

		const activeSlideNumber = store.getState().currentActiveSlideNumber;

		expect(isSlideElementHasZindex(slideElements[lastSlideNumber])).toBe(true);
		expect(activeSlideNumber).toBe(lastSlideNumber);
	});

	test("Stop others slide navigating process if the current process is not done yet (indicate with 'isSlideNavigating' in store state)", () => {
		new Multiscroll();

		store.setState({
			type: "SLIDING-PROCESS",
			values: {
				isSlideNavigating: true,
			},
		});

		fireEvent.wheel(document, {
			deltaY: 60,
		});

		const defaultSlideActiveNumber = 0;
		const activeSlideNumber = store.getState().currentActiveSlideNumber;

		expect(activeSlideNumber).toBe(defaultSlideActiveNumber);
	});

	describe("Mobile view - wheel event won't work if the current viewport is mobile view", () => {
		test("Won't do anything when wheel navigation is triggered", () => {
			const originalInnerWidth = window.innerWidth;

			window.innerWidth = 400;

			new Multiscroll();

			fireEvent.wheel(document, {
				deltaY: 60,
			});

			jest.advanceTimersByTime(610);

			fireEvent.wheel(document, {
				deltaY: 60,
			});

			const defaultSlideActiveNumber = 0;
			const activeSlideNumber = store.getState().currentActiveSlideNumber;

			expect(activeSlideNumber).toBe(defaultSlideActiveNumber);

			// Restore the original window.innerWidth
			window.innerWidth = originalInnerWidth;
		});
	});
});
