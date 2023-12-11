import { fireEvent, screen, prettyDOM } from "@testing-library/dom";
import "@testing-library/jest-dom";

import setupHTML from "../../helpers/setupHTML.js";
import setupStore from "../../helpers/setupStore.js";
import store from "../../../dekstop/multiscroll/javascript/store.js";
import Multiscroll from "../../../dekstop/multiscroll/javascript/Multiscroll.js";

beforeEach(() => {
	setupHTML();
	setupStore();

	jest.useFakeTimers();
});

afterEach(() => {
	jest.useRealTimers();
});

describe("WheelScrollNavigation - Integration Testing", () => {
	test("wheel until the last slide and nav buttons, slides and the current active slide number changes accordingly", () => {
		new Multiscroll();

		const ACTIVE_CLASSNAME = "mys-multiscroll-nav__btn--active";
		const slideElements = screen.getAllByText(/Slide \d+ (Left|Full)/);
		const totalSlideElements = slideElements.length;

		for (let slideIdx = 1; slideIdx < totalSlideElements; slideIdx++) {
			if (slideIdx !== totalSlideElements - 1) {
				fireEvent.wheel(document, {
					deltaY: 60,
				});

				jest.advanceTimersByTime(1000);
			}

			if (slideIdx === totalSlideElements - 1) {
				fireEvent.wheel(document, {
					deltaY: 60,
				});
			}

			const nextSlideNumber = slideIdx;
			const currentActiveSlideNumber = store.getState().currentActiveSlideNumber;

			const nextSlideElement = slideElements[currentActiveSlideNumber].parentElement.parentElement;
			const prevSlideElement = slideElements[currentActiveSlideNumber - 1].parentElement.parentElement;

			const nextNavBtnElement = screen.getByRole("button", { name: `to slide ${currentActiveSlideNumber}` });
			const prevNavBtnElement = screen.getByRole("button", { name: `to slide ${currentActiveSlideNumber - 1}` });

			expect(currentActiveSlideNumber).toBe(nextSlideNumber);

			expect(nextNavBtnElement).toHaveClass(ACTIVE_CLASSNAME);
			expect(prevNavBtnElement).not.toHaveClass(ACTIVE_CLASSNAME);

			expect(prevSlideElement).not.toHaveStyle({ zIndex: 1 });
			expect(prevSlideElement).toHaveAttribute("aria-hidden", "true");

			expect(nextSlideElement).toHaveStyle({ zIndex: 1 });
			expect(nextSlideElement).toHaveAttribute("aria-hidden", "false");
		}
	});

	test("wheel until the first slide and nav buttons, slides and the current active slide number changes accordingly", () => {
		new Multiscroll();

		const ACTIVE_CLASSNAME = "mys-multiscroll-nav__btn--active";
		const slideElements = screen.getAllByText(/Slide \d+ (Left|Full)/);
		const totalSlideElements = slideElements.length;

		fireEvent.keyDown(document, {
			key: "End",
		});

		jest.advanceTimersByTime(610);

		for (let slideIdx = totalSlideElements - 2; slideIdx >= 0; slideIdx--) {
			if (slideIdx !== 0) {
				fireEvent.wheel(document, {
					deltaY: -60,
				});

				jest.advanceTimersByTime(610);
			}

			if (slideIdx === 0) {
				fireEvent.wheel(document, {
					deltaY: -60,
				});
			}

			const nextSlideNumber = slideIdx;
			const currentActiveSlideNumber = store.getState().currentActiveSlideNumber;

			const nextSlideElement = slideElements[currentActiveSlideNumber].parentElement.parentElement;
			const prevSlideElement = slideElements[currentActiveSlideNumber + 1].parentElement.parentElement;

			const nextNavBtnElement = screen.getByRole("button", { name: `to slide ${currentActiveSlideNumber}` });
			const prevNavBtnElement = screen.getByRole("button", { name: `to slide ${currentActiveSlideNumber + 1}` });

			expect(nextNavBtnElement).toHaveClass(ACTIVE_CLASSNAME);
			expect(prevNavBtnElement).not.toHaveClass(ACTIVE_CLASSNAME);

			expect(prevSlideElement).not.toHaveStyle({ zIndex: 1 });
			expect(prevSlideElement).toHaveAttribute("aria-hidden", "true");

			expect(nextSlideElement).toHaveStyle({ zIndex: 1 });
			expect(nextSlideElement).toHaveAttribute("aria-hidden", "false");

			expect(currentActiveSlideNumber).toBe(nextSlideNumber);
		}
	});

	test("should do nothing if the deltaY value is not face the minimum of the value", () => {
		new Multiscroll();

		const defaultActiveSlideNumber = 0;

		const ACTIVE_CLASSNAME = "mys-multiscroll-nav__btn--active";
		const navBtnElements = screen.getAllByRole("button", { name: /to slide \d+/ });
		const totalNavBtnElements = navBtnElements.length;
		const firstNavBtnElement = navBtnElements[0];

		const slideElements = screen.getAllByText(/Slide \d+ (Left|Full)/);
		const firstSlideElement = slideElements[0].parentElement.parentElement;

		fireEvent.wheel(document, {
			deltaY: 10,
		});

		expect(store.getState().currentActiveSlideNumber).toBe(defaultActiveSlideNumber);

		expect(firstNavBtnElement).toHaveClass(ACTIVE_CLASSNAME);

		expect(firstSlideElement).toHaveStyle({ zIndex: 1 });
		expect(firstSlideElement).toHaveAttribute("aria-hidden", "false");

		for (let btnIdx = 1; btnIdx < totalNavBtnElements; btnIdx++) {
			const navBtnElement = navBtnElements[btnIdx];

			expect(navBtnElement).not.toHaveClass(ACTIVE_CLASSNAME);
		}

		for (let slideIdx = 1; slideIdx < slideElements.length; slideIdx++) {
			const slideElement = slideElements[slideIdx].parentElement.parentElement;

			expect(slideElement).not.toHaveStyle({ zIndex: 1 });
			expect(slideElement).toHaveAttribute("aria-hidden", "true");
		}
	});

	test("should do nothing if other navigating process is not done yet", () => {
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

		const defaultActiveSlideNumber = 0;

		const ACTIVE_CLASSNAME = "mys-multiscroll-nav__btn--active";
		const navBtnElements = screen.getAllByRole("button", { name: /to slide \d+/ });
		const totalNavBtnElements = navBtnElements.length;
		const firstNavBtnElement = navBtnElements[0];

		const slideElements = screen.getAllByText(/Slide \d+ (Left|Full)/);
		const firstSlideElement = slideElements[0].parentElement.parentElement;

		expect(store.getState().currentActiveSlideNumber).toBe(defaultActiveSlideNumber);

		expect(firstNavBtnElement).toHaveClass(ACTIVE_CLASSNAME);

		expect(firstSlideElement).toHaveStyle({ zIndex: 1 });
		expect(firstSlideElement).toHaveAttribute("aria-hidden", "false");

		for (let btnIdx = 1; btnIdx < totalNavBtnElements; btnIdx++) {
			const navBtnElement = navBtnElements[btnIdx];

			expect(navBtnElement).not.toHaveClass(ACTIVE_CLASSNAME);
		}

		for (let slideIdx = 1; slideIdx < slideElements.length; slideIdx++) {
			const slideElement = slideElements[slideIdx].parentElement.parentElement;

			expect(slideElement).not.toHaveStyle({ zIndex: 1 });
			expect(slideElement).toHaveAttribute("aria-hidden", "true");
		}
	});

	test("should do nothing the current viewport is mobile size", () => {
		const originalInnerWidth = window.innerWidth;

		window.innerWidth = 400;

		new Multiscroll();

		fireEvent.wheel(document, {
			deltaY: 60,
		});

		jest.advanceTimersByTime(610);

		fireEvent.wheel(document, {
			deltaY: -60,
		});

		jest.advanceTimersByTime(610);

		fireEvent.wheel(document, {
			deltaY: 60,
		});

		jest.advanceTimersByTime(610);

		fireEvent.wheel(document, {
			deltaY: 60,
		});

		jest.advanceTimersByTime(610);

		fireEvent.wheel(document, {
			deltaY: 60,
		});

		jest.advanceTimersByTime(610);

		fireEvent.wheel(document, {
			deltaY: -60,
		});

		const defaultActiveSlideNumber = 0;
		const currentActiveSlideNumber = store.getState().currentActiveSlideNumber;

		const slideElements = screen.getAllByText(/Slide \d+ (Left|Full)/);

		expect(currentActiveSlideNumber).toBe(defaultActiveSlideNumber);

		for (let slideIdx = 0; slideIdx < slideElements.length; slideIdx++) {
			const slideElement = slideElements[slideIdx].parentElement.parentElement;

			expect(slideElement).not.toHaveStyle({ zIndex: 1 });
			expect(slideElement).not.toHaveAttribute("aria-hidden");
		}

		// Restore the original window.innerWidth
		window.innerWidth = originalInnerWidth;
	});
});
