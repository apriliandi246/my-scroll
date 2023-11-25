import { fireEvent } from "@testing-library/dom";

import setup from "../utils/setupBeforeTest.js";

beforeEach(() => {
	setup();
});

const ACTIVE_CLASSNAME = "mys-multiscroll-nav__btn--active";

function isNavBtnElementHasActiveClass(btnElement) {
	const isBtnElementHasActiveClass = btnElement.classList.contains(ACTIVE_CLASSNAME) ? true : false;

	return isBtnElementHasActiveClass;
}

describe("ButtonNavigation", () => {
	test("Add active classname when current navigation button is clicked", () => {
		const navBtnElement = document.querySelector(".mys-multiscroll-nav__btn:nth-child(2)");

		fireEvent.click(navBtnElement);

		expect(isNavBtnElementHasActiveClass(navBtnElement)).toBe(true);
		expect(isNavBtnElementHasActiveClass(navBtnElement)).toBeTruthy();
	});

	test("Remove active classname for the previous nav button", () => {
		const prevNavBtnElement = document.querySelector(".mys-multiscroll-nav__btn:nth-child(1)");
		const nextNavBtnElement = document.querySelector(".mys-multiscroll-nav__btn:nth-child(2)");

		fireEvent.click(nextNavBtnElement);

		expect(isNavBtnElementHasActiveClass(prevNavBtnElement)).toBe(false);
		expect(isNavBtnElementHasActiveClass(prevNavBtnElement)).toBeFalsy();
	});

	test("Add active classname for current clicked nav button and remove active classname for previous one", () => {
		const prevNavBtnElement = document.querySelector(".mys-multiscroll-nav__btn:nth-child(1)");
		const nextNavBtnElement = document.querySelector(".mys-multiscroll-nav__btn:nth-child(3)");

		fireEvent.click(nextNavBtnElement);

		expect(isNavBtnElementHasActiveClass(prevNavBtnElement)).toBe(false);
		expect(isNavBtnElementHasActiveClass(prevNavBtnElement)).toBeFalsy();

		expect(isNavBtnElementHasActiveClass(nextNavBtnElement)).toBe(true);
		expect(isNavBtnElementHasActiveClass(nextNavBtnElement)).toBeTruthy();
	});

	test("Nothing changes if you click the currently active nav button", () => {
		const navBtnElements = document.getElementsByClassName("mys-multiscroll-nav__btn");
		const navBtnElement = navBtnElements[4];

		fireEvent.click(navBtnElement);

		for (let navBtnIdx = 0; navBtnIdx < navBtnElements.length; navBtnIdx++) {
			if (navBtnIdx !== 4) {
				const btnNavElement = navBtnElements[navBtnIdx];

				expect(isNavBtnElementHasActiveClass(btnNavElement)).toBe(false);
				expect(isNavBtnElementHasActiveClass(btnNavElement)).toBeFalsy();
			}
		}
	});
});
