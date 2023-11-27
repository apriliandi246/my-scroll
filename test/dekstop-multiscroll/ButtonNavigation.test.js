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
});

describe("ButtonNavigation", () => {
	test("add active classname when click the next nav button", () => {
		new Multiscroll();

		const nextNavBtnElement = document.querySelector(".mys-multiscroll-nav__btn:nth-child(2)");

		fireEvent.click(nextNavBtnElement);

		expect(isNavBtnElementHasActiveClass(nextNavBtnElement)).toBe(true);
	});

	test("remove active classname for the previous nav button", () => {
		new Multiscroll();

		const prevNavBtnElement = document.querySelector(".mys-multiscroll-nav__btn:nth-child(1)");
		const nextNavBtnElement = document.querySelector(".mys-multiscroll-nav__btn:nth-child(2)");

		fireEvent.click(nextNavBtnElement);

		expect(isNavBtnElementHasActiveClass(prevNavBtnElement)).toBe(false);
	});

	test("add active classname for next nav button and remove active classname for previous one", () => {
		new Multiscroll();

		const prevNavBtnElement = document.querySelector(".mys-multiscroll-nav__btn:nth-child(1)");
		const nextNavBtnElement = document.querySelector(".mys-multiscroll-nav__btn:nth-child(3)");

		fireEvent.click(nextNavBtnElement);

		expect(isNavBtnElementHasActiveClass(nextNavBtnElement)).toBe(true);
		expect(isNavBtnElementHasActiveClass(prevNavBtnElement)).toBe(false);
	});

	test("go to the next nav button and come back to previous nav button", () => {
		new Multiscroll();

		const prevNavBtnElement = document.querySelector(".mys-multiscroll-nav__btn:nth-child(1)");
		const nextNavBtnElement = document.querySelector(".mys-multiscroll-nav__btn:nth-child(2)");

		fireEvent.click(nextNavBtnElement);

		expect(isNavBtnElementHasActiveClass(prevNavBtnElement)).toBe(false);
		expect(isNavBtnElementHasActiveClass(nextNavBtnElement)).toBe(true);
		expect(store.getState().currentActiveSlideNumber).toBe(1);

		fireEvent.click(prevNavBtnElement);

		expect(isNavBtnElementHasActiveClass(nextNavBtnElement)).toBe(false);
		expect(isNavBtnElementHasActiveClass(prevNavBtnElement)).toBe(true);
		expect(store.getState().currentActiveSlideNumber).toBe(0);
	});

	test("go to the next nav button and come back to previous nav button (more than one nav button distance)", () => {
		new Multiscroll();

		const prevNavBtnElement = document.querySelector(".mys-multiscroll-nav__btn:nth-child(1)");
		const nextNavBtnElement = document.querySelector(".mys-multiscroll-nav__btn:nth-child(4)");

		fireEvent.click(nextNavBtnElement);

		expect(isNavBtnElementHasActiveClass(prevNavBtnElement)).toBe(false);
		expect(isNavBtnElementHasActiveClass(nextNavBtnElement)).toBe(true);
		expect(store.getState().currentActiveSlideNumber).toBe(3);

		fireEvent.click(prevNavBtnElement);

		expect(isNavBtnElementHasActiveClass(nextNavBtnElement)).toBe(false);
		expect(isNavBtnElementHasActiveClass(prevNavBtnElement)).toBe(true);
		expect(store.getState().currentActiveSlideNumber).toBe(0);
	});

	test("navigating until the last nav button (start at the first one) and check the important data if it's right accordingly", () => {
		new Multiscroll();

		const navBtnElements = document.getElementsByClassName("mys-multiscroll-nav__btn");
		const navBtnElementsTotal = navBtnElements.length - 1;

		for (let btnIdex = 1; btnIdex <= navBtnElementsTotal; btnIdex++) {
			const navBtnElement = navBtnElements[btnIdex];

			fireEvent.click(navBtnElement);

			expect(isNavBtnElementHasActiveClass(navBtnElement)).toBe(true);
			expect(store.getState().currentActiveSlideNumber).toBe(btnIdex);
		}
	});

	test("navigating until the last nav button and back to the previous nav button and check the important data if it's right accordingly", () => {
		new Multiscroll();

		const navBtnElements = document.getElementsByClassName("mys-multiscroll-nav__btn");
		const navBtnElementsTotal = navBtnElements.length - 1;

		for (let btnIdex = 1; btnIdex <= navBtnElementsTotal; btnIdex++) {
			const navBtnElement = navBtnElements[btnIdex];

			fireEvent.click(navBtnElement);

			expect(isNavBtnElementHasActiveClass(navBtnElement)).toBe(true);
			expect(store.getState().currentActiveSlideNumber).toBe(btnIdex);
		}

		for (let btnIdex = navBtnElementsTotal - 1; btnIdex >= 0; btnIdex--) {
			const navBtnElement = navBtnElements[btnIdex];

			fireEvent.click(navBtnElement);

			expect(isNavBtnElementHasActiveClass(navBtnElement)).toBe(true);
			expect(store.getState().currentActiveSlideNumber).toBe(btnIdex);
		}
	});

	test("navigate for each nav buttons and active slide change accordingly", () => {
		new Multiscroll();

		const slideElements = document.getElementsByClassName("mys-multiscroll-slide");
		const navBtnElements = document.getElementsByClassName("mys-multiscroll-nav__btn");
		const navBtnElementsTotal = navBtnElements.length - 1;

		for (let btnIdex = 1; btnIdex <= navBtnElementsTotal; btnIdex++) {
			const slideElement = slideElements[btnIdex];
			const navBtnElement = navBtnElements[btnIdex];

			fireEvent.click(navBtnElement);

			expect(isNavBtnElementHasActiveClass(navBtnElement)).toBe(true);
			expect(getAriaHiddenAttr(slideElement)).toBe(false);
			expect(isSlideElementHasZindex(slideElement)).toBe(true);
			expect(store.getState().currentActiveSlideNumber).toBe(btnIdex);
		}

		for (let btnIdex = navBtnElementsTotal - 1; btnIdex >= 0; btnIdex--) {
			const slideElement = slideElements[btnIdex];
			const navBtnElement = navBtnElements[btnIdex];

			fireEvent.click(navBtnElement);

			expect(isNavBtnElementHasActiveClass(navBtnElement)).toBe(true);
			expect(getAriaHiddenAttr(slideElement)).toBe(false);
			expect(isSlideElementHasZindex(slideElement)).toBe(true);
			expect(store.getState().currentActiveSlideNumber).toBe(btnIdex);
		}
	});

	test("nothing is changes if you click the current active nav button", () => {
		new Multiscroll();

		const firstNavBtnElement = document.querySelector(".mys-multiscroll-nav__btn:first-child");

		fireEvent.click(firstNavBtnElement);

		const activeSlideNumber = store.getState().currentActiveSlideNumber;

		expect(activeSlideNumber).toBe(0);
	});

	test("button navigation won't work when the button navigations is not on the DOM", () => {
		const navBtnContainer = document.querySelector(".mys-multiscroll-nav");
		navBtnContainer.remove();

		new Multiscroll();

		const navBtnElements = document.getElementsByClassName("mys-multiscroll-nav__btn");

		expect(navBtnElements.length).toBe(0);
	});

	test("button navigation won't work if the current process is still processing (indicate with 'isSlideNavigating' in store state)", () => {
		new Multiscroll();

		store.setState({
			type: "SLIDING-PROCESS",
			values: {
				isSlideNavigating: true,
			},
		});

		const secondNavBtnElement = document.querySelector(".mys-multiscroll-nav__btn:nth-child(2)");

		fireEvent.click(secondNavBtnElement);

		const activeSlideNumber = store.getState().currentActiveSlideNumber;

		expect(isNavBtnElementHasActiveClass(secondNavBtnElement)).toBe(false);
		expect(activeSlideNumber).toBe(0);
	});

	test("button navigation won't work when comes to mobile view", () => {
		const originalInnerWidth = window.innerWidth;

		window.innerWidth = 400;

		new Multiscroll();

		const nextNavBtnElement = document.querySelector(".mys-multiscroll-nav__btn:nth-child(2)");

		fireEvent.click(nextNavBtnElement);

		const activeSlideNumber = store.getState().currentActiveSlideNumber;

		expect(isNavBtnElementHasActiveClass(nextNavBtnElement)).toBe(false);
		expect(activeSlideNumber).toBe(0);

		// Restore the original window.innerWidth
		window.innerWidth = originalInnerWidth;
	});
});
