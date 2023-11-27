import { fireEvent, prettyDOM } from "@testing-library/dom";

import store from "../../dekstop/multiscroll/javascript/store.js";
import Multiscroll from "../../dekstop/multiscroll/javascript/Multiscroll.js";

import setupCSS from "../utils/setupCSS.js";
import setupHTML from "../utils/setupHTML.js";
import setupStore from "../utils/setupStore.js";
import getAriaHiddenAttr from "../utils/getAriaHiddenAttr.js";
import isSlideElementHasZindex from "../utils/isSlideElementHasZindex.js";
import isNavBtnElementHasActiveClass from "../utils/isNavBtnElementHasActiveClass.js";

beforeEach(() => {
	setupCSS();
	setupHTML();
	setupStore();

	jest.useFakeTimers();
});

afterEach(() => {
	jest.useRealTimers();
});

describe("KeyboardNavigation", () => {
	describe("Home - the first slide become the active slide", () => {
		test("Active slide has important attributes (aria hidden equal false and z-index inline style)", () => {
			new Multiscroll();

			fireEvent.keyDown(document, {
				key: "End",
			});

			jest.advanceTimersByTime(610);

			fireEvent.keyDown(document, {
				key: "Home",
			});

			const firstSlideElement = document.querySelector(".mys-multiscroll-slide:first-child");

			expect(getAriaHiddenAttr(firstSlideElement)).toBe(false);
			expect(isSlideElementHasZindex(firstSlideElement)).toBe(true);
		});

		test("The store state of 'currentActiveSlideNumber' is equal to the first number of the slide (start with zero)", () => {
			new Multiscroll();

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
			new Multiscroll();

			fireEvent.keyDown(document, {
				key: "End",
			});

			const lastSlideElement = document.querySelector(".mys-multiscroll-slide:last-child");

			expect(getAriaHiddenAttr(lastSlideElement)).toBe(false);
			expect(isSlideElementHasZindex(lastSlideElement)).toBe(true);
		});

		test("The store state of 'currentActiveSlideNumber' is equal to the last number of the slide (start with zero)", () => {
			new Multiscroll();

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
			new Multiscroll();

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
			new Multiscroll();

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
		test("Active slide has important attributes for the first and the last slide (aria hidden equal false and z-index inline style)", () => {
			new Multiscroll();

			fireEvent.keyDown(document, {
				key: "ArrowDown",
			});

			const nextSlideElement = document.querySelector(".mys-multiscroll-slide:nth-child(2)");

			expect(getAriaHiddenAttr(nextSlideElement)).toBe(false);
			expect(isSlideElementHasZindex(nextSlideElement)).toBe(true);
		});

		test("The store state of 'currentActiveSlideNumber' is equal to next slide number of the slide (start with zero)", () => {
			new Multiscroll();

			fireEvent.keyDown(document, {
				key: "ArrowDown",
			});

			const nextSlideNumber = 1;
			const activeSlideNumber = store.getState().currentActiveSlideNumber;

			expect(activeSlideNumber).toBe(nextSlideNumber);
		});

		test("The last slide still an active slide if we press ArrowDown when the last slide is active", () => {
			new Multiscroll();

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

			expect(getAriaHiddenAttr(lastSlideElement)).toBe(false);
			expect(isSlideElementHasZindex(lastSlideElement)).toBe(true);
			expect(activeSlideNumber).toBe(lastSlideNumber);
		});
	});

	describe("PageDown - go to the next slide", () => {
		test("Active slide has important attributes for the first and the last slide (aria hidden equal false and z-index inline style)", () => {
			new Multiscroll();

			fireEvent.keyDown(document, {
				key: "PageDown",
			});

			const nextSlideElement = document.querySelector(".mys-multiscroll-slide:nth-child(2)");

			expect(getAriaHiddenAttr(nextSlideElement)).toBe(false);
			expect(isSlideElementHasZindex(nextSlideElement)).toBe(true);
		});

		test("The store state of 'currentActiveSlideNumber' is equal to next slide number of the slide (start with zero)", () => {
			new Multiscroll();

			const nextSlideNumber = 1;

			fireEvent.keyDown(document, {
				key: "PageDown",
			});

			const activeSlideNumber = store.getState().currentActiveSlideNumber;

			expect(activeSlideNumber).toBe(nextSlideNumber);
		});

		test("The last slide still an active slide if we press PageDown when the last slide is active", () => {
			new Multiscroll();

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

			expect(getAriaHiddenAttr(lastSlideElement)).toBe(false);
			expect(isSlideElementHasZindex(lastSlideElement)).toBe(true);
			expect(activeSlideNumber).toBe(lastSlideNumber);
		});
	});

	describe("ArrowUp - go to the previous slide", () => {
		test("Active slide has important attributes for the first and the last slide (aria hidden equal false and z-index inline style)", () => {
			new Multiscroll();

			fireEvent.keyDown(document, {
				key: "ArrowDown",
			});

			jest.advanceTimersByTime(610);

			fireEvent.keyDown(document, {
				key: "ArrowUp",
			});

			const previousSlideElement = document.querySelector(".mys-multiscroll-slide:first-child");

			expect(getAriaHiddenAttr(previousSlideElement)).toBe(false);
			expect(isSlideElementHasZindex(previousSlideElement)).toBe(true);
		});

		test("The store state of 'currentActiveSlideNumber' is equal to previous slide number of the slide (start with zero)", () => {
			new Multiscroll();

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
			new Multiscroll();

			fireEvent.keyDown(document, {
				key: "ArrowUp",
			});

			const firstSlideNumber = 0;
			const firstSlideElement = document.querySelector(".mys-multiscroll-slide:first-child");
			const activeSlideNumber = store.getState().currentActiveSlideNumber;

			expect(getAriaHiddenAttr(firstSlideElement)).toBe(false);
			expect(isSlideElementHasZindex(firstSlideElement)).toBe(true);
			expect(activeSlideNumber).toBe(firstSlideNumber);
		});
	});

	describe("PageUp - go to the previous slide", () => {
		test("Active slide has important attributes (aria hidden equal false and z-index inline style)", () => {
			new Multiscroll();

			fireEvent.keyDown(document, {
				key: "ArrowDown",
			});

			jest.advanceTimersByTime(610);

			fireEvent.keyDown(document, {
				key: "PageUp",
			});

			const previousSlideElement = document.querySelector(".mys-multiscroll-slide:first-child");

			expect(getAriaHiddenAttr(previousSlideElement)).toBe(false);
			expect(isSlideElementHasZindex(previousSlideElement)).toBe(true);
		});

		test("The store state of 'currentActiveSlideNumber' is equal to previous slide number of the slide (start with zero)", () => {
			new Multiscroll();

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
			new Multiscroll();

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

	describe("Stop others slide navigating process if the current process is not done yet (indicate with 'isSlideNavigating' in store state)", () => {
		test("Active slide has important attributes (aria hidden equal false and z-index inline style)", () => {
			new Multiscroll();

			store.setState({
				type: "SLIDING-PROCESS",
				values: {
					isSlideNavigating: true,
				},
			});

			fireEvent.keyDown(document, {
				key: "ArrowDown",
			});

			const firstSlideElement = document.querySelector(".mys-multiscroll-slide:first-child");
			const secondSlideElement = document.querySelector(".mys-multiscroll-slide:nth-child(2)");

			expect(getAriaHiddenAttr(firstSlideElement)).toBe(false);
			expect(isSlideElementHasZindex(firstSlideElement)).toBe(true);

			expect(getAriaHiddenAttr(secondSlideElement)).toBe(true);
			expect(isSlideElementHasZindex(secondSlideElement)).toBe(false);
		});

		test("The store state of 'currentActiveSlideNumber' is equal to the first number of the slide (start with zero)", () => {
			new Multiscroll();

			store.setState({
				type: "SLIDING-PROCESS",
				values: {
					isSlideNavigating: true,
				},
			});

			fireEvent.keyDown(document, {
				key: "ArrowDown",
			});

			const firstSlideNumber = 0;
			const activeSlideNumber = store.getState().currentActiveSlideNumber;

			expect(activeSlideNumber).toBe(firstSlideNumber);
		});
	});

	describe("Keyboard navigation and button nav", () => {
		test("Nav button is active as when navigating to others slide accordingly to the slide number", () => {
			new Multiscroll();

			fireEvent.keyDown(document, {
				key: "ArrowDown",
			});

			const nextNavBtnElement = document.querySelector(".mys-multiscroll-nav__btn:nth-child(2)");

			expect(isNavBtnElementHasActiveClass(nextNavBtnElement)).toBe(true);
		});

		test("Nothing happen for nav buttons if the elements is not exist in the DOM while keyboard navigation is triggered", () => {
			const navBtnContainer = document.querySelector(".mys-multiscroll-nav");
			navBtnContainer.remove();

			new Multiscroll();

			fireEvent.keyDown(document, {
				key: "ArrowDown",
			});

			const navBtnElements = document.getElementsByClassName("mys-multiscroll-nav__btn");

			expect(navBtnElements.length).toBe(0);
		});
	});

	describe("Mobile view - keyboard event won't work if the current viewport is mobile view", () => {
		test("Won't do anything when keyboard navigation is triggered", () => {
			const originalInnerWidth = window.innerWidth;

			window.innerWidth = 400;

			new Multiscroll();

			fireEvent.keyDown(document, {
				key: "ArrowDown",
			});

			jest.advanceTimersByTime(610);

			fireEvent.keyDown(document, {
				key: "ArrowDown",
			});

			const defaultSlideActiveNumber = 0;
			const activeSlideNumber = store.getState().currentActiveSlideNumber;

			expect(activeSlideNumber).toBe(defaultSlideActiveNumber);

			// Restore the original window.innerWidth
			window.innerWidth = originalInnerWidth;
		});
	});
});
