import { fireEvent, prettyDOM } from "@testing-library/dom";

import setup from "../utils/setupBeforeTest.js";
import isSlideElementHasZindex from "../utils/isSlideElementHasZindex.js";
import store from "../../dekstop/multiscroll/javascript/store.js";

beforeEach(() => {
	setup();
	jest.useFakeTimers();
});

afterEach(() => {
	jest.useRealTimers();
});

describe("WheelScrollNavigation", () => {
	test("Wheel navigation will not work if the deltaY value is not face the minimum and the first slide still an active slide", () => {
		fireEvent.wheel(document, {
			deltaY: 50,
		});

		const firstSlideNumber = 0;
		const firstSlideElement = document.querySelector(".mys-multiscroll-slide:first-child");
		const activeSlideNumber = store.getState().currentActiveSlideNumber;

		expect(isSlideElementHasZindex(firstSlideElement)).toBe(true);
		expect(activeSlideNumber).toBe(firstSlideNumber);
	});

	test("Wheel/scroll to the bottom to go to the next slide", () => {
		fireEvent.wheel(document, {
			deltaY: 60,
		});

		const nextSlideNumber = 1;
		const nextSlideElement = document.querySelector(".mys-multiscroll-slide:nth-child(2)");
		const activeSlideNumber = store.getState().currentActiveSlideNumber;

		expect(isSlideElementHasZindex(nextSlideElement)).toBe(true);
		expect(activeSlideNumber).toBe(nextSlideNumber);
	});

	test("Wheel/scroll to the top to go to the previous slide", () => {
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
});
