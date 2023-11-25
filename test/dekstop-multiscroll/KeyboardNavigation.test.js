import { fireEvent, prettyDOM } from "@testing-library/dom";

import setup from "../utils/setupBeforeTest.js";
import getAriaHiddenAttr from "../utils/getAriaHiddenAttr.js";
import isSlideElementHasZindex from "../utils/isSlideElementHasZindex.js";
import store from "../../dekstop/multiscroll/javascript/store.js";

beforeEach(() => {
	setup();
	jest.useFakeTimers();
});

afterEach(() => {
	jest.useRealTimers();
});

describe("KeyboardNavigation", () => {
	describe("Home - the first slide become the active slide", () => {
		test("Active slide has important attributes (aria hidden equal false and z-index inline style)", () => {
			fireEvent.keyDown(document, {
				key: "End",
			});

			jest.advanceTimersByTime(610);

			fireEvent.keyDown(document, {
				key: "Home",
			});

			const slideElements = document.getElementsByClassName("mys-multiscroll-slide");
			const firstSlideElement = slideElements[0];

			expect(getAriaHiddenAttr(firstSlideElement)).toBe(false);
			expect(isSlideElementHasZindex(firstSlideElement)).toBe(true);
		});

		test("The store state of 'currentActiveSlideNumber' is equal to the first number of the slide (start with zero)", () => {
			fireEvent.keyDown(document, {
				key: "End",
			});

			jest.advanceTimersByTime(610);

			fireEvent.keyDown(document, {
				key: "Home",
			});

			const firstSlideNumber = 0;
			const activeSlideNumber = store.getState().currentActiveSlideNumber;

			expect(activeSlideNumber).toBe(firstSlideNumber);
		});
	});

	describe("End - the last slide become the active slide", () => {
		test("Active slide has important attributes (aria hidden equal false and z-index inline style)", () => {
			fireEvent.keyDown(document, {
				key: "End",
			});

			const slideElements = document.getElementsByClassName("mys-multiscroll-slide");
			const lastSlideElement = slideElements[slideElements.length - 1];

			expect(getAriaHiddenAttr(lastSlideElement)).toBe(false);
			expect(isSlideElementHasZindex(lastSlideElement)).toBe(true);
		});

		test("The store state of 'currentActiveSlideNumber' is equal to the last number of the slide (start with zero)", () => {
			fireEvent.keyDown(document, {
				key: "End",
			});

			const slideElements = document.getElementsByClassName("mys-multiscroll-slide");
			const lastSlideNumber = slideElements.length - 1;

			const activeSlideNumber = store.getState().currentActiveSlideNumber;

			expect(activeSlideNumber).toBe(lastSlideNumber);
		});
	});

	describe("Home and End - press End key after that press Home key", () => {
		test("Active slide has important attributes for the first and the last slide (aria hidden equal false and z-index inline style)", () => {
			fireEvent.keyDown(document, {
				key: "End",
			});

			const slides = document.getElementsByClassName("mys-multiscroll-slide");

			const firstSlideNumber = 0;
			const firstSlideElement = slides[firstSlideNumber];

			const lastSlideNumber = slides.length - 1;
			const lastSlideElement = slides[lastSlideNumber];

			expect(getAriaHiddenAttr(lastSlideElement)).toBe(false);
			expect(isSlideElementHasZindex(lastSlideElement)).toBe(true);

			jest.advanceTimersByTime(610);

			fireEvent.keyDown(document, {
				key: "Home",
			});

			expect(getAriaHiddenAttr(firstSlideElement)).toBe(false);
			expect(isSlideElementHasZindex(firstSlideElement)).toBe(true);
		});

		test("The store state of 'currentActiveSlideNumber' is equal to the current active slide number", () => {
			fireEvent.keyDown(document, {
				key: "End",
			});

			const slides = document.getElementsByClassName("mys-multiscroll-slide");
			const firstSlideNumber = 0;
			const lastSlideNumber = slides.length - 1;

			expect(store.getState().currentActiveSlideNumber).toBe(lastSlideNumber);

			jest.advanceTimersByTime(610);

			fireEvent.keyDown(document, {
				key: "Home",
			});

			expect(store.getState().currentActiveSlideNumber).toBe(firstSlideNumber);
		});
	});

	describe("ArrowDown - go to the next slide", () => {
		test("Next slide has z-index inline style", () => {
			fireEvent.keyDown(document, {
				key: "ArrowDown",
			});

			const slideElements = document.getElementsByClassName("mys-multiscroll-slide");
			const nextSlideElement = slideElements[1];

			expect(isSlideElementHasZindex(nextSlideElement)).toBe(true);
		});

		test("The store state of 'currentActiveSlideNumber' is equal to next slide number of the slide (start with zero)", () => {
			fireEvent.keyDown(document, {
				key: "ArrowDown",
			});

			const nextSlideNumber = 1;
			const activeSlideNumber = store.getState().currentActiveSlideNumber;

			expect(activeSlideNumber).toBe(nextSlideNumber);
		});

		test("The last slide still an active slide if we press ArrowDown when the last slide is active", () => {
			fireEvent.keyDown(document, {
				key: "End",
			});

			jest.advanceTimersByTime(610);

			fireEvent.keyDown(document, {
				key: "ArrowDown",
			});

			const slideElements = document.getElementsByClassName("mys-multiscroll-slide");

			const lastSlideNumber = slideElements.length - 1;
			const lastSlideElement = slideElements[lastSlideNumber];

			const activeSlideNumber = store.getState().currentActiveSlideNumber;

			expect(isSlideElementHasZindex(lastSlideElement)).toBe(true);
			expect(activeSlideNumber).toBe(lastSlideNumber);
		});
	});

	describe("PageDown - go to the next slide", () => {
		test("Next slide has z-index inline style", () => {
			fireEvent.keyDown(document, {
				key: "PageDown",
			});

			const slideElements = document.getElementsByClassName("mys-multiscroll-slide");
			const nextSlideElement = slideElements[1];

			expect(isSlideElementHasZindex(nextSlideElement)).toBe(true);
		});

		test("The store state of 'currentActiveSlideNumber' is equal to next slide number of the slide (start with zero)", () => {
			const nextSlideNumber = 1;

			fireEvent.keyDown(document, {
				key: "PageDown",
			});

			const activeSlideNumber = store.getState().currentActiveSlideNumber;

			expect(activeSlideNumber).toBe(nextSlideNumber);
		});

		test("The last slide still an active slide if we press PageDown when the last slide is active", () => {
			fireEvent.keyDown(document, {
				key: "End",
			});

			jest.advanceTimersByTime(610);

			fireEvent.keyDown(document, {
				key: "PageDown",
			});

			const slideElements = document.getElementsByClassName("mys-multiscroll-slide");

			const lastSlideNumber = slideElements.length - 1;
			const lastSlideElement = slideElements[lastSlideNumber];

			const activeSlideNumber = store.getState().currentActiveSlideNumber;

			expect(isSlideElementHasZindex(lastSlideElement)).toBe(true);
			expect(activeSlideNumber).toBe(lastSlideNumber);
		});
	});

	describe("ArrowUp - go to the previous slide", () => {
		test("Previous slide has z-index inline style after go to the next slide", () => {
			fireEvent.keyDown(document, {
				key: "ArrowDown",
			});

			jest.advanceTimersByTime(610);

			fireEvent.keyDown(document, {
				key: "ArrowUp",
			});

			const slideElements = document.getElementsByClassName("mys-multiscroll-slide");
			const previousSlideElement = slideElements[0];

			expect(isSlideElementHasZindex(previousSlideElement)).toBe(true);
		});

		test("The store state of 'currentActiveSlideNumber' is equal to previous slide number of the slide (start with zero)", () => {
			fireEvent.keyDown(document, {
				key: "ArrowDown",
			});

			jest.advanceTimersByTime(610);

			fireEvent.keyDown(document, {
				key: "ArrowUp",
			});

			const firstSlideNumber = 0;
			const activeSlideNumber = store.getState().currentActiveSlideNumber;

			expect(activeSlideNumber).toBe(firstSlideNumber);
		});

		test("The first slide still an active slide if we press ArrowUp when the first slide is active", () => {
			fireEvent.keyDown(document, {
				key: "ArrowUp",
			});

			const slideElements = document.getElementsByClassName("mys-multiscroll-slide");

			const firstSlideNumber = 0;
			const firstSlideElement = slideElements[firstSlideNumber];

			const activeSlideNumber = store.getState().currentActiveSlideNumber;

			expect(isSlideElementHasZindex(firstSlideElement)).toBe(true);
			expect(activeSlideNumber).toBe(activeSlideNumber);
		});
	});

	describe("PageUp - go to the previous slide", () => {
		test("Previous slide has z-index inline style after go to the next slide", () => {
			fireEvent.keyDown(document, {
				key: "ArrowDown",
			});

			jest.advanceTimersByTime(610);

			fireEvent.keyDown(document, {
				key: "PageUp",
			});

			const slideElements = document.getElementsByClassName("mys-multiscroll-slide");
			const previousSlideElement = slideElements[0];

			expect(isSlideElementHasZindex(previousSlideElement)).toBe(true);
		});

		test("The store state of 'currentActiveSlideNumber' is equal to previous slide number of the slide (start with zero)", () => {
			fireEvent.keyDown(document, {
				key: "ArrowDown",
			});

			jest.advanceTimersByTime(610);

			fireEvent.keyDown(document, {
				key: "PageUp",
			});

			const firstSlideNumber = 0;
			const activeSlideNumber = store.getState().currentActiveSlideNumber;

			expect(activeSlideNumber).toBe(firstSlideNumber);
		});

		test("The first slide still an active slide if we press PageUp when the first slide is active", () => {
			fireEvent.keyDown(document, {
				key: "PageUp",
			});

			const slideElements = document.getElementsByClassName("mys-multiscroll-slide");

			const firstSlideNumber = 0;
			const firstSlideElement = slideElements[firstSlideNumber];
			const activeSlideNumber = store.getState().currentActiveSlideNumber;

			expect(isSlideElementHasZindex(firstSlideElement)).toBe(true);
			expect(activeSlideNumber).toBe(firstSlideNumber);
		});
	});

	describe("Mobile view - keyboard event does not do anything if the current viewport is mobile view", () => {
		test("First slide has important attributes (aria hidden equal false and z-index inline style)", () => {
			window.innerWidth = 400;

			fireEvent.keyDown(document, {
				key: "ArrowDown",
			});

			const firstSlideElement = document.querySelector(".mys-multiscroll-slide:first-child");

			expect(getAriaHiddenAttr(firstSlideElement)).toBe(false);
			expect(isSlideElementHasZindex(firstSlideElement)).toBe(true);
		});

		test("The store state of 'currentActiveSlideNumber' is equal to the first number of the slide (start with zero)", () => {
			window.innerWidth = 400;

			fireEvent.keyDown(document, {
				key: "End",
			});

			const firstSlideNumber = 0;
			const activeSlideNumber = store.getState().currentActiveSlideNumber;

			expect(activeSlideNumber).toBe(firstSlideNumber);
		});
	});
});
