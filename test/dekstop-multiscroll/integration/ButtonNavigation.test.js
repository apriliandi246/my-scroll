import { fireEvent, screen } from "@testing-library/dom";
import "@testing-library/jest-dom";

import setupCSS from "../../utils/setupCSS.js";
import setupHTML from "../../utils/setupHTML.js";
import setupStore from "../../utils/setupStore.js";
import store from "../../../dekstop/multiscroll/javascript/store.js";
import Multiscroll from "../../../dekstop/multiscroll/javascript/Multiscroll.js";

beforeEach(() => {
	setupHTML();
	setupCSS();
	setupStore();
});

describe("ButtonNavigation - Integration Test", () => {
	test("should do nothing for nav buttons and slides if other navigating process is not done yet", () => {
		new Multiscroll();

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

	test("navigate to next nav button and the nav button and slide changes accordingly", () => {
		new Multiscroll();

		const ACTIVE_CLASSNAME = "mys-multiscroll-nav__btn--active";
		const currentActiveNavBtnElement = screen.getByRole("button", { name: "to slide 0" });
		const nextNavBtnElement = screen.getByRole("button", { name: "to slide 1" });

		const nextSlideElement = screen.getByText(/Slide 1 (Left|Full)/).parentElement.parentElement;

		fireEvent.click(nextNavBtnElement);

		expect(nextNavBtnElement).toHaveClass(ACTIVE_CLASSNAME);
		expect(currentActiveNavBtnElement).not.toHaveClass(ACTIVE_CLASSNAME);

		expect(nextSlideElement).toHaveStyle({ zIndex: 1 });
		expect(nextSlideElement).toHaveAttribute("aria-hidden", "false");
	});

	test("navigating until the last nav button and the slides and nav buttons changes accordingly", () => {
		new Multiscroll();

		const ACTIVE_CLASSNAME = "mys-multiscroll-nav__btn--active";
		const navBtnElements = screen.getAllByRole("button", { name: /to slide \d+/ });

		for (let btnIdx = 1; btnIdx < navBtnElements.length; btnIdx++) {
			const nextNavBtnElement = navBtnElements[btnIdx];
			const prevNavBtnActiveElement = navBtnElements[btnIdx - 1];

			const prevRegexSlideSelector = new RegExp(`Slide ${btnIdx - 1} (Left|Full)`);
			const prevSlideActiveElement = screen.getByText(prevRegexSlideSelector).parentElement.parentElement;

			const nextRegexSlideSelector = new RegExp(`Slide ${btnIdx} (Left|Full)`);
			const nextSlideActiveElement = screen.getByText(nextRegexSlideSelector).parentElement.parentElement;

			fireEvent.click(nextNavBtnElement);

			expect(prevNavBtnActiveElement).not.toHaveClass(ACTIVE_CLASSNAME);
			expect(nextNavBtnElement).toHaveClass(ACTIVE_CLASSNAME);

			expect(prevSlideActiveElement).not.toHaveStyle({ zIndex: 1 });
			expect(prevSlideActiveElement).toHaveAttribute("aria-hidden", "true");

			expect(nextSlideActiveElement).toHaveStyle({ zIndex: 1 });
			expect(nextSlideActiveElement).toHaveAttribute("aria-hidden", "false");
		}
	});

	test("navigating until the first nav button and the slides and nav buttons changes accordingly", () => {
		new Multiscroll();

		const ACTIVE_CLASSNAME = "mys-multiscroll-nav__btn--active";
		const navBtnElements = screen.getAllByRole("button", { name: /to slide \d+/ });
		const lastNavBtnElement = navBtnElements[navBtnElements.length - 1];

		fireEvent.click(lastNavBtnElement);

		expect(lastNavBtnElement).toHaveClass(ACTIVE_CLASSNAME);

		for (let btnIdx = navBtnElements.length - 2; btnIdx >= 0; btnIdx--) {
			const nextNavBtnElement = navBtnElements[btnIdx];
			const prevNavBtnElement = navBtnElements[btnIdx + 1];

			const prevRegexSlideSelector = new RegExp(`Slide ${btnIdx + 1} (Left|Full)`);
			const prevSlideElement = screen.getByText(prevRegexSlideSelector).parentElement.parentElement;

			const nextRegexSlideSelector = new RegExp(`Slide ${btnIdx} (Left|Full)`);
			const nextSlideElement = screen.getByText(nextRegexSlideSelector).parentElement.parentElement;

			fireEvent.click(nextNavBtnElement);

			expect(prevNavBtnElement).not.toHaveClass(ACTIVE_CLASSNAME);
			expect(nextNavBtnElement).toHaveClass(ACTIVE_CLASSNAME);

			expect(prevSlideElement).not.toHaveStyle({ zIndex: 1 });
			expect(prevSlideElement).toHaveAttribute("aria-hidden", "true");

			expect(nextSlideElement).toHaveStyle({ zIndex: 1 });
			expect(nextSlideElement).toHaveAttribute("aria-hidden", "false");
		}
	});
});
