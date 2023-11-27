import { fireEvent, prettyDOM } from "@testing-library/dom";

import store from "../../dekstop/multiscroll/javascript/store.js";
import Multiscroll from "../../dekstop/multiscroll/javascript/Multiscroll.js";

import setupCSS from "../utils/setupCSS.js";
import setupHTML from "../utils/setupHTML.js";
import setupStore from "../utils/setupStore.js";
import isNavBtnElementHasActiveClass from "../utils/isNavBtnElementHasActiveClass.js";

beforeEach(() => {
	setupCSS();
	setupHTML();
	setupStore();
});

describe("ButtonNavigation", () => {
	test("Add active classname when click the next nav button", () => {
		new Multiscroll();

		const nextNavBtnElement = document.querySelector(".mys-multiscroll-nav__btn:nth-child(2)");

		fireEvent.click(nextNavBtnElement);

		expect(isNavBtnElementHasActiveClass(nextNavBtnElement)).toBe(true);
	});

	test("Remove active classname for the previous nav button", () => {
		new Multiscroll();

		const prevNavBtnElement = document.querySelector(".mys-multiscroll-nav__btn:nth-child(1)");
		const nextNavBtnElement = document.querySelector(".mys-multiscroll-nav__btn:nth-child(2)");

		fireEvent.click(nextNavBtnElement);

		expect(isNavBtnElementHasActiveClass(prevNavBtnElement)).toBe(false);
	});

	test("Add active classname for current clicked nav button and remove active classname for previous one", () => {
		new Multiscroll();

		const prevNavBtnElement = document.querySelector(".mys-multiscroll-nav__btn:nth-child(1)");
		const nextNavBtnElement = document.querySelector(".mys-multiscroll-nav__btn:nth-child(3)");

		fireEvent.click(nextNavBtnElement);

		expect(isNavBtnElementHasActiveClass(prevNavBtnElement)).toBe(false);
		expect(isNavBtnElementHasActiveClass(nextNavBtnElement)).toBe(true);
	});

	test("Go to the next nav button and come back to previous nav button", () => {
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

	test("Go to the next nav button and come back to previous nav button (more than one nav button distance)", () => {
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

	test("Nothing changes if you click the current active nav button", () => {
		new Multiscroll();

		const firstNavBtnElement = document.querySelector(".mys-multiscroll-nav__btn:first-child");

		fireEvent.click(firstNavBtnElement);

		const activeSlideNumber = store.getState().currentActiveSlideNumber;

		expect(activeSlideNumber).toBe(0);
	});

	test("Button navigation won't work when the button navigations is not on the DOM", () => {
		const navBtnContainer = document.querySelector(".mys-multiscroll-nav");
		navBtnContainer.remove();

		new Multiscroll();

		const navBtnElements = document.getElementsByClassName("mys-multiscroll-nav__btn");

		expect(navBtnElements.length).toBe(0);
	});

	test("Button navigation won't work if the current process is still processing (indicate with 'isSlideNavigating' in store state)", () => {
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

	test("Button navigation won't work when comes to mobile view", () => {
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
