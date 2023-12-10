import { fireEvent, screen } from "@testing-library/dom";
import "@testing-library/jest-dom";

import setupHTML from "../../utils/setupHTML.js";
import setupStore from "../../utils/setupStore.js";
import Multiscroll from "../../../dekstop/multiscroll/javascript/Multiscroll.js";

beforeEach(() => {
	setupHTML();
	setupStore();
});

describe("ButtonNavigation - Unit Test", () => {
	test("the nav button currently clicked become an active nav button", () => {
		new Multiscroll();

		const ACTIVE_CLASSNAME = "mys-multiscroll-nav__btn--active";
		const navBtnElement = screen.getByRole("button", { name: "to slide 1" });

		fireEvent.click(navBtnElement);

		expect(navBtnElement).toHaveClass(ACTIVE_CLASSNAME);
	});

	test("should do nothing if user click the current active nav button", () => {
		new Multiscroll();

		const ACTIVE_CLASSNAME = "mys-multiscroll-nav__btn--active";
		const navBtnElements = screen.getAllByRole("button", { name: /to slide \d+/ });
		const currentActiveNavBtnElement = navBtnElements[0];

		fireEvent.click(currentActiveNavBtnElement);

		expect(currentActiveNavBtnElement).toHaveClass(ACTIVE_CLASSNAME);

		for (let btnIdx = 1; btnIdx < navBtnElements.length; btnIdx++) {
			const navBtnElement = navBtnElements[btnIdx];

			expect(navBtnElement).not.toHaveClass(ACTIVE_CLASSNAME);
		}
	});

	test("the nav button currently clicked become active and the previous nav button become unactive", () => {
		new Multiscroll();

		const ACTIVE_CLASSNAME = "mys-multiscroll-nav__btn--active";
		const prevNavBtnElement = screen.getByRole("button", { name: "to slide 0" });
		const currentNavBtnElement = screen.getByRole("button", { name: "to slide 1" });

		fireEvent.click(currentNavBtnElement);

		expect(currentNavBtnElement).toHaveClass(ACTIVE_CLASSNAME);
		expect(prevNavBtnElement).not.toHaveClass(ACTIVE_CLASSNAME);
	});

	test("should do nothing if the current viewport is mobile size", () => {
		const originalInnerWidth = window.innerWidth;

		window.innerWidth = 400;

		new Multiscroll();

		const ACTIVE_CLASSNAME = "mys-multiscroll-nav__btn--active";
		const navBtnElements = screen.getAllByRole("button", { name: /to slide \d+/ });
		const currentNavBtnActiveElement = screen.getByRole("button", { name: "to slide 0" });
		const nextNavBtnElement = screen.getByRole("button", { name: "to slide 1" });

		fireEvent.click(nextNavBtnElement);

		expect(currentNavBtnActiveElement).toHaveClass(ACTIVE_CLASSNAME);

		for (let btnIdx = 1; btnIdx < navBtnElements.length; btnIdx++) {
			const navBtnElement = navBtnElements[btnIdx];
			expect(navBtnElement).not.toHaveClass(ACTIVE_CLASSNAME);
		}

		// Restore the original window.innerWidth
		window.innerWidth = originalInnerWidth;
	});
});
