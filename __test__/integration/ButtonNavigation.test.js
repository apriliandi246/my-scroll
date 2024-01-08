import { fireEvent, screen } from "@testing-library/dom";
import "@testing-library/jest-dom";

import setupHTML from "../helpers/setupHTML.js";
import setupStore from "../helpers/setupStore.js";
import store from "../../packages/js/store.js";
import Multiscroll from "../../packages/js/Multiscroll.js";

beforeEach(() => {
	setupHTML();
	setupStore();
});

describe("ButtonNavigation - Integration Test", () => {
	test("navigating until the last nav button and the slides, nav buttons and the current active slide number changes accordingly", () => {
		new Multiscroll();

		const ACTIVE_CLASSNAME = "mys-multiscroll-nav__btn--active";
		const navBtnElements = screen.getAllByRole("button", { name: /to slide \d+/ });

		for (let btnIdx = 1; btnIdx < navBtnElements.length; btnIdx++) {
			const nextNavBtnElement = navBtnElements[btnIdx];

			fireEvent.click(nextNavBtnElement);

			const nextSlideNumber = btnIdx;
			const currentActiveSlideNumber = store.getState().currentActiveSlideNumber;

			const prevNavBtnElement = navBtnElements[currentActiveSlideNumber - 1];

			const prevRegexSlideSelector = new RegExp(`Slide ${currentActiveSlideNumber - 1} (Left|Full)`);
			const prevSlideActiveElement = screen.getByText(prevRegexSlideSelector).parentElement.parentElement;

			const nextRegexSlideSelector = new RegExp(`Slide ${currentActiveSlideNumber} (Left|Full)`);
			const nextSlideActiveElement = screen.getByText(nextRegexSlideSelector).parentElement.parentElement;

			expect(currentActiveSlideNumber).toBe(nextSlideNumber);

			expect(prevNavBtnElement).not.toHaveClass(ACTIVE_CLASSNAME);
			expect(nextNavBtnElement).toHaveClass(ACTIVE_CLASSNAME);

			expect(prevSlideActiveElement).not.toHaveStyle({ zIndex: 1 });
			expect(prevSlideActiveElement).toHaveAttribute("aria-hidden", "true");

			expect(nextSlideActiveElement).toHaveStyle({ zIndex: 1 });
			expect(nextSlideActiveElement).toHaveAttribute("aria-hidden", "false");
		}
	});

	test("navigating until the first nav button and the slides, nav buttons and the current active slide number changes accordingly", () => {
		new Multiscroll();

		const ACTIVE_CLASSNAME = "mys-multiscroll-nav__btn--active";
		const navBtnElements = screen.getAllByRole("button", { name: /to slide \d+/ });
		const lastNavBtnElement = navBtnElements[navBtnElements.length - 1];

		fireEvent.click(lastNavBtnElement);

		for (let btnIdx = navBtnElements.length - 2; btnIdx >= 0; btnIdx--) {
			const nextNavBtnElement = navBtnElements[btnIdx];

			fireEvent.click(nextNavBtnElement);

			const nextSlideNumber = btnIdx;
			const currentActiveSlideNumber = store.getState().currentActiveSlideNumber;

			const prevNavBtnElement = navBtnElements[currentActiveSlideNumber + 1];

			const prevRegexSlideSelector = new RegExp(`Slide ${currentActiveSlideNumber + 1} (Left|Full)`);
			const prevSlideElement = screen.getByText(prevRegexSlideSelector).parentElement.parentElement;

			const nextRegexSlideSelector = new RegExp(`Slide ${currentActiveSlideNumber} (Left|Full)`);
			const nextSlideElement = screen.getByText(nextRegexSlideSelector).parentElement.parentElement;

			expect(currentActiveSlideNumber).toBe(nextSlideNumber);

			expect(prevNavBtnElement).not.toHaveClass(ACTIVE_CLASSNAME);
			expect(nextNavBtnElement).toHaveClass(ACTIVE_CLASSNAME);

			expect(prevSlideElement).not.toHaveStyle({ zIndex: 1 });
			expect(prevSlideElement).toHaveAttribute("aria-hidden", "true");

			expect(nextSlideElement).toHaveStyle({ zIndex: 1 });
			expect(nextSlideElement).toHaveAttribute("aria-hidden", "false");
		}
	});

	test("should do nothing if other navigating process is not done yet", () => {
		new Multiscroll();

		const defaultActiveSlideNumber = 0;

		const ACTIVE_CLASSNAME = "mys-multiscroll-nav__btn--active";
		const navBtnElements = screen.getAllByRole("button", { name: /to slide \d+/ });
		const currentActiveNavBtnElement = navBtnElements[0];
		const nextNavBtnElement = navBtnElements[1];

		const slideElements = screen.getAllByText(/Slide \d+ (Left|Full)/);
		const currentActiveSlideElement = slideElements[0].parentElement.parentElement;

		store.setState({
			type: "SLIDING-PROCESS",
			values: {
				isSlideNavigating: true,
			},
		});

		fireEvent.click(nextNavBtnElement);

		expect(store.getState().currentActiveSlideNumber).toBe(defaultActiveSlideNumber);

		expect(currentActiveNavBtnElement).toHaveClass(ACTIVE_CLASSNAME);

		expect(currentActiveSlideElement).toHaveStyle({ zIndex: 1 });
		expect(currentActiveSlideElement).toHaveAttribute("aria-hidden", "false");

		for (let btnIdx = 1; btnIdx < navBtnElements.length; btnIdx++) {
			const navBtnElement = navBtnElements[btnIdx];

			expect(navBtnElement).not.toHaveClass(ACTIVE_CLASSNAME);
		}

		for (let slideIdx = 1; slideIdx < slideElements.length; slideIdx++) {
			const slideElement = slideElements[slideIdx].parentElement.parentElement;

			expect(slideElement).not.toHaveStyle({ zIndex: 1 });
			expect(slideElement).toHaveAttribute("aria-hidden", "true");
		}
	});
});
