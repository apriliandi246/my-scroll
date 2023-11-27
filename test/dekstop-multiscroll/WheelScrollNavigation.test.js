import { fireEvent, prettyDOM } from "@testing-library/dom";

import store from "../../dekstop/multiscroll/javascript/store.js";
import Multiscroll from "../../dekstop/multiscroll/javascript/Multiscroll.js";

import setupCSS from "../utils/setupCSS.js";
import setupHTML from "../utils/setupHTML.js";
import setupStore from "../utils/setupStore.js";
import getAriaHiddenAttr from "../utils/getAriaHiddenAttr.js";
import isHasNoAriaHiddenAttr from "../utils/isHasNoAriaHiddenAttr.js";
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
	test("the next slide become an active slide", () => {
		new Multiscroll();

		fireEvent.wheel(document, {
			deltaY: 60,
		});

		const nextSlideNumber = 1;
		const nextSlideElement = document.querySelector(".mys-multiscroll-slide:nth-child(2)");
		const activeSlideNumber = store.getState().currentActiveSlideNumber;

		expect(getAriaHiddenAttr(nextSlideElement)).toBe(false);
		expect(isSlideElementHasZindex(nextSlideElement)).toBe(true);
		expect(activeSlideNumber).toBe(nextSlideNumber);
	});

	test("wheel navigation will not work if the deltaY value is not face the minimum and the first slide still an active slide", () => {
		new Multiscroll();

		fireEvent.wheel(document, {
			deltaY: 10,
		});

		const firstSlideNumber = 0;
		const firstSlideElement = document.querySelector(".mys-multiscroll-slide:first-child");
		const activeSlideNumber = store.getState().currentActiveSlideNumber;

		expect(getAriaHiddenAttr(firstSlideElement)).toBe(false);
		expect(isSlideElementHasZindex(firstSlideElement)).toBe(true);
		expect(activeSlideNumber).toBe(firstSlideNumber);
	});

	test("the first slide should become an active slide", () => {
		new Multiscroll();

		fireEvent.wheel(document, {
			deltaY: 60,
		});

		jest.advanceTimersByTime(610);

		fireEvent.wheel(document, {
			deltaY: -60,
		});

		const firstSlideNumber = 0;
		const firstSlideElement = document.querySelector(".mys-multiscroll-slide:first-child");
		const activeSlideNumber = store.getState().currentActiveSlideNumber;

		expect(getAriaHiddenAttr(firstSlideElement)).toBe(false);
		expect(isSlideElementHasZindex(firstSlideElement)).toBe(true);
		expect(activeSlideNumber).toBe(firstSlideNumber);
	});

	test("wheel to the top doesn't do anything if the first slide is currently an active slide", () => {
		new Multiscroll();

		fireEvent.wheel(document, {
			deltaY: -60,
		});

		const firstSlideNumber = 0;
		const firstSlideElement = document.querySelector(".mys-multiscroll-slide:first-child");
		const activeSlideNumber = store.getState().currentActiveSlideNumber;

		expect(getAriaHiddenAttr(firstSlideElement)).toBe(false);
		expect(isSlideElementHasZindex(firstSlideElement)).toBe(true);
		expect(activeSlideNumber).toBe(firstSlideNumber);
	});

	test("wheel until at the last of the slide", () => {
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

		const lastSlideElement = slideElements[lastSlideNumber];
		const activeSlideNumber = store.getState().currentActiveSlideNumber;

		expect(getAriaHiddenAttr(lastSlideElement)).toBe(false);
		expect(isSlideElementHasZindex(lastSlideElement)).toBe(true);
		expect(activeSlideNumber).toBe(lastSlideNumber);
	});

	test("wheel to the bottom doesn't do anything if the the slide is currently an active slide", () => {
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

		const lastSlideElement = slideElements[lastSlideNumber];
		const activeSlideNumber = store.getState().currentActiveSlideNumber;

		expect(getAriaHiddenAttr(lastSlideElement)).toBe(false);
		expect(isSlideElementHasZindex(lastSlideElement)).toBe(true);
		expect(activeSlideNumber).toBe(lastSlideNumber);
	});

	test("stop others slide navigating process if the current process is not done yet", () => {
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

		const firstSlideNumber = 0;
		const firstSlideElement = document.querySelector(".mys-multiscroll-slide:first-child");
		const activeSlideNumber = store.getState().currentActiveSlideNumber;

		expect(getAriaHiddenAttr(firstSlideElement)).toBe(false);
		expect(isSlideElementHasZindex(firstSlideElement)).toBe(true);
		expect(activeSlideNumber).toBe(firstSlideNumber);
	});

	describe("Mobile view - wheel event won't work if the current viewport is mobile view", () => {
		test("won't do anything when wheel navigation is triggered", () => {
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

			const firstSlideNumber = 0;
			const activeSlideNumber = store.getState().currentActiveSlideNumber;
			const firstSlideElement = document.querySelector(".mys-multiscroll-slide:first-child");

			expect(isHasNoAriaHiddenAttr(firstSlideElement)).toBe(true);
			expect(isSlideElementHasZindex(firstSlideElement)).toBe(false);
			expect(activeSlideNumber).toBe(firstSlideNumber);

			// Restore the original window.innerWidth
			window.innerWidth = originalInnerWidth;
		});
	});
});
