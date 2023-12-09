import { fireEvent, screen, prettyDOM } from "@testing-library/dom";
import "@testing-library/jest-dom";

import setupCSS from "../../utils/setupCSS.js";
import setupHTML from "../../utils/setupHTML.js";
import setupStore from "../../utils/setupStore.js";
import store from "../../../dekstop/multiscroll/javascript/store.js";
import Multiscroll from "../../../dekstop/multiscroll/javascript/Multiscroll.js";

beforeEach(() => {
	setupCSS();
	setupHTML();
	setupStore();

	jest.useFakeTimers();
});

afterEach(() => {
	jest.useRealTimers();
});

describe("WheelScrollNavigation - Integration Testing", () => {
	test("go to the next slide", () => {
		new Multiscroll();

		const nextSlideElement = screen.getByText(/Slide 1 (Left|Full)/).parentElement.parentElement;

		fireEvent.wheel(document, {
			deltaY: 60,
		});

		expect(nextSlideElement).toHaveStyle({ zIndex: 1 });
		expect(nextSlideElement).toHaveAttribute("aria-hidden", "false");
	});

	test("wheel until the last slide and nav buttons and slides changes accordingly", () => {
		new Multiscroll();

		const ACTIVE_CLASSNAME = "mys-multiscroll-nav__btn--active";
		const slideElements = screen.getAllByText(/Slide \d+ (Left|Full)/);
		const totalSlideElements = slideElements.length;

		for (let slideIdx = 1; slideIdx < totalSlideElements; slideIdx++) {
			const prevSlideElement = slideElements[slideIdx - 1].parentElement.parentElement;
			const nextSlideElement = slideElements[slideIdx].parentElement.parentElement;

			const prevNavBtnElement = screen.getByRole("button", { name: `to slide ${slideIdx - 1}` });
			const nextButtonElement = screen.getByRole("button", { name: `to slide ${slideIdx}` });

			if (slideIdx !== totalSlideElements - 1) {
				fireEvent.wheel(document, {
					deltaY: 60,
				});

				jest.advanceTimersByTime(610);
			}

			if (slideIdx === totalSlideElements - 1) {
				fireEvent.wheel(document, {
					deltaY: 60,
				});
			}

			expect(nextButtonElement).toHaveClass(ACTIVE_CLASSNAME);
			expect(prevNavBtnElement).not.toHaveClass(ACTIVE_CLASSNAME);

			expect(prevSlideElement).not.toHaveStyle({ zIndex: 1 });
			expect(prevSlideElement).toHaveAttribute("aria-hidden", "true");

			expect(nextSlideElement).toHaveStyle({ zIndex: 1 });
			expect(nextSlideElement).toHaveAttribute("aria-hidden", "false");
		}
	});

	test("wheel until the last slide and comback until at the first slide and nav buttons and slides changes accordingly", () => {
		new Multiscroll();

		let prevNavBtnElement;
		const ACTIVE_CLASSNAME = "mys-multiscroll-nav__btn--active";
		const slideElements = screen.getAllByText(/Slide \d+ (Left|Full)/);
		const totalSlideElements = slideElements.length;

		for (let slideIdx = 1; slideIdx < totalSlideElements; slideIdx++) {
			const slideElement = slideElements[slideIdx].parentElement.parentElement;

			fireEvent.wheel(document, {
				deltaY: 60,
			});

			jest.advanceTimersByTime(610);

			expect(slideElement).toHaveStyle({ zIndex: 1 });
			expect(slideElement).toHaveAttribute("aria-hidden", "false");
		}

		for (let slideIdx = totalSlideElements - 2; slideIdx >= 0; slideIdx--) {
			const prevSlideElement = slideElements[slideIdx + 1].parentElement.parentElement;
			const nextSlideElement = slideElements[slideIdx].parentElement.parentElement;

			if (slideIdx !== 0) {
				prevNavBtnElement = screen.getByRole("button", { name: `to slide ${slideIdx - 1}` });
			}

			const nextNavBtnElement = screen.getByRole("button", { name: `to slide ${slideIdx}` });

			fireEvent.wheel(document, {
				deltaY: -60,
			});

			jest.advanceTimersByTime(610);

			expect(nextNavBtnElement).toHaveClass(ACTIVE_CLASSNAME);

			if (slideIdx !== 0) {
				expect(prevNavBtnElement).not.toHaveClass(ACTIVE_CLASSNAME);
			}

			expect(prevSlideElement).not.toHaveStyle({ zIndex: 1 });
			expect(prevSlideElement).toHaveAttribute("aria-hidden", "true");

			expect(nextSlideElement).toHaveStyle({ zIndex: 1 });
			expect(nextSlideElement).toHaveAttribute("aria-hidden", "false");
		}
	});

	test("should do nothing if the deltaY value is not face the minimum value", () => {
		new Multiscroll();

		const slideElements = screen.getAllByText(/Slide \d+ (Left|Full)/);
		const firstSlideElement = slideElements[0].parentElement.parentElement;

		fireEvent.wheel(document, {
			deltaY: 10,
		});

		expect(firstSlideElement).toHaveStyle({ zIndex: 1 });
		expect(firstSlideElement).toHaveAttribute("aria-hidden", "false");

		for (let slideIdx = 1; slideIdx < slideElements.length; slideIdx++) {
			const slideElement = slideElements[slideIdx].parentElement.parentElement;

			expect(slideElement).not.toHaveStyle({ zIndex: 1 });
			expect(slideElement).toHaveAttribute("aria-hidden", "true");
		}
	});

	test("should do nothing if other navigating process is not done yet", () => {
		new Multiscroll();

		const slideElements = screen.getAllByText(/Slide \d+ (Left|Full)/);
		const firstSlideElement = slideElements[0].parentElement.parentElement;

		store.setState({
			type: "SLIDING-PROCESS",
			values: {
				isSlideNavigating: true,
			},
		});

		fireEvent.wheel(document, {
			deltaY: 60,
		});

		jest.advanceTimersByTime(1000);

		expect(firstSlideElement).toHaveStyle({ zIndex: 1 });
		expect(firstSlideElement).toHaveAttribute("aria-hidden", "false");

		for (let slideIdx = 1; slideIdx < slideElements.length; slideIdx++) {
			const slideElement = slideElements[slideIdx].parentElement.parentElement;

			expect(slideElement).not.toHaveStyle({ zIndex: 1 });
			expect(slideElement).toHaveAttribute("aria-hidden", "true");
		}
	});
});
