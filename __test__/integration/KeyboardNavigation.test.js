import { fireEvent, screen, prettyDOM } from "@testing-library/dom";
import "@testing-library/jest-dom";

import setupHTML from "../helpers/setupHTML.js";
import setupStore from "../helpers/setupStore.js";
import store from "../../packages/js/store.js";
import Multiscroll from "../../packages/js/Multiscroll.js";

beforeEach(() => {
	setupHTML();
	setupStore();

	jest.useFakeTimers();
});

afterEach(() => {
	jest.useRealTimers();
});

describe("KeyboardNavigation - Integration Test", () => {
	test("should do nothing for nav buttons and slides if other navigating process is not done yet", () => {
		new Multiscroll();

		const ACTIVE_CLASSNAME = "mys-multiscroll-nav__btn--active";
		const navBtnElements = screen.getAllByRole("button", { name: /to slide \d+/ });
		const currentActiveNavBtnElement = navBtnElements[0];

		const slideElements = screen.getAllByText(/Slide \d+ (Left|Full)/);
		const currentActiveSlideElement = slideElements[0].parentElement.parentElement;

		store.setState({
			type: "SLIDING-PROCESS",
			values: {
				isSlideNavigating: true,
			},
		});

		fireEvent.keyDown(document, {
			key: "ArrowDown",
		});

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

	describe("ArrowDown", () => {
		test("navigate until the last slide and nav buttons, slides and the current active slide number changes accordingly", () => {
			new Multiscroll();

			const ACTIVE_CLASSNAME = "mys-multiscroll-nav__btn--active";
			const slideElements = screen.getAllByText(/Slide \d+ (Left|Full)/);
			const totalSlides = slideElements.length;

			for (let slideIdx = 1; slideIdx < totalSlides; slideIdx++) {
				if (slideIdx !== totalSlides - 1) {
					fireEvent.keyDown(document, {
						key: "ArrowDown",
					});

					jest.advanceTimersByTime(610);
				}

				if (slideIdx === totalSlides - 1) {
					fireEvent.keyDown(document, {
						key: "ArrowDown",
					});
				}

				const nextSlideNumber = slideIdx;
				const currentActiveSlideNumber = store.getState().currentActiveSlideNumber;

				const nextSlideElement = slideElements[currentActiveSlideNumber].parentElement.parentElement;
				const prevSlideElement = slideElements[currentActiveSlideNumber - 1].parentElement.parentElement;

				const nextNavBtnElement = screen.getByRole("button", { name: `to slide ${currentActiveSlideNumber}` });
				const prevNavBtnElement = screen.getByRole("button", { name: `to slide ${currentActiveSlideNumber - 1}` });

				expect(nextNavBtnElement).toHaveClass(ACTIVE_CLASSNAME);
				expect(prevNavBtnElement).not.toHaveClass(ACTIVE_CLASSNAME);

				expect(prevSlideElement).not.toHaveStyle({ zIndex: 1 });
				expect(prevSlideElement).toHaveAttribute("aria-hidden", "true");

				expect(nextSlideElement).toHaveStyle({ zIndex: 1 });
				expect(nextSlideElement).toHaveAttribute("aria-hidden", "false");

				expect(currentActiveSlideNumber).toBe(nextSlideNumber);
			}
		});

		test("should do nothing for nav buttons and slides if user press the ArrowDown key when at the last slide", () => {
			new Multiscroll();

			const ACTIVE_CLASSNAME = "mys-multiscroll-nav__btn--active";
			const navBtnElements = screen.getAllByRole("button", { name: /to slide \d+/ });
			const totalNavBtnElements = navBtnElements.length;
			const lastNavBtnElement = navBtnElements[totalNavBtnElements - 1];

			const slideElements = screen.getAllByText(/Slide \d+ (Left|Full)/);
			const totalSlideElements = slideElements.length;
			const lastSlideElement = slideElements[totalSlideElements - 1].parentElement.parentElement;

			fireEvent.keyDown(document, {
				key: "End",
			});

			jest.advanceTimersByTime(610);

			fireEvent.keyDown(document, {
				key: "ArrowDown",
			});

			expect(lastNavBtnElement).toHaveClass(ACTIVE_CLASSNAME);

			expect(lastSlideElement).toHaveStyle({ zIndex: 1 });
			expect(lastSlideElement).toHaveAttribute("aria-hidden", "false");

			for (let btnIdx = 1; btnIdx < totalNavBtnElements; btnIdx++) {
				const navBtnElement = navBtnElements[btnIdx];

				if (btnIdx !== totalNavBtnElements - 1) {
					expect(navBtnElement).not.toHaveClass(ACTIVE_CLASSNAME);
				}
			}

			for (let slideIdx = 1; slideIdx < totalSlideElements; slideIdx++) {
				if (slideIdx !== totalSlideElements - 1) {
					const slideElement = slideElements[slideIdx].parentElement.parentElement;

					expect(slideElement).not.toHaveStyle({ zIndex: 1 });
					expect(slideElement).toHaveAttribute("aria-hidden", "true");
				}
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

			fireEvent.keyDown(document, {
				key: "ArrowDown",
			});

			const defaultActiveSlideNumber = 0;
			const currentActiveSlideNumber = store.getState().currentActiveSlideNumber;

			expect(currentActiveSlideNumber).toBe(defaultActiveSlideNumber);
		});
	});

	describe("PageDown", () => {
		test("navigate until the last slide and nav buttons, slides and the current active slide number changes accordingly", () => {
			new Multiscroll();

			const ACTIVE_CLASSNAME = "mys-multiscroll-nav__btn--active";
			const slideElements = screen.getAllByText(/Slide \d+ (Left|Full)/);
			const totalSlides = slideElements.length;

			for (let slideIdx = 1; slideIdx < totalSlides; slideIdx++) {
				if (slideIdx !== totalSlides - 1) {
					fireEvent.keyDown(document, {
						key: "PageDown",
					});

					jest.advanceTimersByTime(610);
				}

				if (slideIdx === totalSlides - 1) {
					fireEvent.keyDown(document, {
						key: "PageDown",
					});
				}

				const nextSlideNumber = slideIdx;
				const currentActiveSlideNumber = store.getState().currentActiveSlideNumber;

				const nextSlideElement = slideElements[currentActiveSlideNumber].parentElement.parentElement;
				const prevSlideElement = slideElements[currentActiveSlideNumber - 1].parentElement.parentElement;

				const nextNavBtnElement = screen.getByRole("button", { name: `to slide ${currentActiveSlideNumber}` });
				const prevNavBtnElement = screen.getByRole("button", { name: `to slide ${currentActiveSlideNumber - 1}` });

				expect(nextNavBtnElement).toHaveClass(ACTIVE_CLASSNAME);
				expect(prevNavBtnElement).not.toHaveClass(ACTIVE_CLASSNAME);

				expect(prevSlideElement).not.toHaveStyle({ zIndex: 1 });
				expect(prevSlideElement).toHaveAttribute("aria-hidden", "true");

				expect(nextSlideElement).toHaveStyle({ zIndex: 1 });
				expect(nextSlideElement).toHaveAttribute("aria-hidden", "false");

				expect(currentActiveSlideNumber).toBe(nextSlideNumber);
			}
		});

		test("should do nothing for nav buttons and slides if user press the PageDown key when at the last slide", () => {
			new Multiscroll();

			const ACTIVE_CLASSNAME = "mys-multiscroll-nav__btn--active";
			const navBtnElements = screen.getAllByRole("button", { name: /to slide \d+/ });
			const totalNavBtnElements = navBtnElements.length;
			const lastNavBtnElement = navBtnElements[totalNavBtnElements - 1];

			const slideElements = screen.getAllByText(/Slide \d+ (Left|Full)/);
			const totalSlideElements = slideElements.length;
			const lastSlideElement = slideElements[totalSlideElements - 1].parentElement.parentElement;

			fireEvent.keyDown(document, {
				key: "End",
			});

			jest.advanceTimersByTime(610);

			fireEvent.keyDown(document, {
				key: "PageDown",
			});

			expect(lastNavBtnElement).toHaveClass(ACTIVE_CLASSNAME);

			expect(lastSlideElement).toHaveStyle({ zIndex: 1 });
			expect(lastSlideElement).toHaveAttribute("aria-hidden", "false");

			for (let btnIdx = 1; btnIdx < totalNavBtnElements; btnIdx++) {
				const navBtnElement = navBtnElements[btnIdx];

				if (btnIdx !== totalNavBtnElements - 1) {
					expect(navBtnElement).not.toHaveClass(ACTIVE_CLASSNAME);
				}
			}

			for (let slideIdx = 1; slideIdx < totalSlideElements; slideIdx++) {
				if (slideIdx !== totalSlideElements - 1) {
					const slideElement = slideElements[slideIdx].parentElement.parentElement;

					expect(slideElement).not.toHaveStyle({ zIndex: 1 });
					expect(slideElement).toHaveAttribute("aria-hidden", "true");
				}
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

			fireEvent.keyDown(document, {
				key: "PageDown",
			});

			const defaultActiveSlideNumber = 0;
			const currentActiveSlideNumber = store.getState().currentActiveSlideNumber;

			expect(currentActiveSlideNumber).toBe(defaultActiveSlideNumber);
		});
	});

	describe("End", () => {
		test("go to the last slide and nav buttons, slides and the current active slide number changes accordingly", () => {
			new Multiscroll();

			const ACTIVE_CLASSNAME = "mys-multiscroll-nav__btn--active";
			const lastNavBtnElement = screen.getByRole("button", { name: "to slide 11" });

			const slideElements = screen.getAllByText(/Slide \d+ (Left|Full)/);
			const lastSlideNumber = slideElements.length - 1;
			const lastSlideElement = slideElements[lastSlideNumber].parentElement.parentElement;

			fireEvent.keyDown(document, {
				key: "End",
			});

			expect(store.getState().currentActiveSlideNumber).toBe(lastSlideNumber);

			expect(lastNavBtnElement).toHaveClass(ACTIVE_CLASSNAME);

			expect(lastSlideElement).toHaveStyle({ zIndex: 1 });
			expect(lastSlideElement).toHaveAttribute("aria-hidden", "false");
		});

		test("should do nothing if user press the End key when at the last slide", () => {
			new Multiscroll();

			const ACTIVE_CLASSNAME = "mys-multiscroll-nav__btn--active";
			const navBtnElements = screen.getAllByRole("button", { name: /to slide \d+/ });
			const totalNavBtnElements = navBtnElements.length;
			const lastNavBtnElement = navBtnElements[totalNavBtnElements - 1];

			const slideElements = screen.getAllByText(/Slide \d+ (Left|Full)/);
			const totalSlideElements = slideElements.length;
			const lastSlideElement = slideElements[totalSlideElements - 1].parentElement.parentElement;

			fireEvent.keyDown(document, {
				key: "End",
			});

			jest.advanceTimersByTime(610);

			fireEvent.keyDown(document, {
				key: "End",
			});

			expect(lastNavBtnElement).toHaveClass(ACTIVE_CLASSNAME);

			expect(store.getState().currentActiveSlideNumber).toBe(totalSlideElements - 1);

			expect(lastSlideElement).toHaveStyle({ zIndex: 1 });
			expect(lastSlideElement).toHaveAttribute("aria-hidden", "false");

			for (let btnIdx = 1; btnIdx < totalNavBtnElements; btnIdx++) {
				const navBtnElement = navBtnElements[btnIdx];

				if (btnIdx !== totalNavBtnElements - 1) {
					expect(navBtnElement).not.toHaveClass(ACTIVE_CLASSNAME);
				}
			}

			for (let slideIdx = 1; slideIdx < totalSlideElements; slideIdx++) {
				if (slideIdx !== totalSlideElements - 1) {
					const slideElement = slideElements[slideIdx].parentElement.parentElement;

					expect(slideElement).not.toHaveStyle({ zIndex: 1 });
					expect(slideElement).toHaveAttribute("aria-hidden", "true");
				}
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

			fireEvent.keyDown(document, {
				key: "End",
			});

			const defaultActiveSlideNumber = 0;
			const currentActiveSlideNumber = store.getState().currentActiveSlideNumber;

			expect(currentActiveSlideNumber).toBe(defaultActiveSlideNumber);
		});
	});

	describe("ArrowUp", () => {
		test("navigate until the first slide and nav buttons, slides and the current active slide number changes accordingly", () => {
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
					fireEvent.keyDown(document, {
						key: "ArrowUp",
					});

					jest.advanceTimersByTime(610);
				}

				if (slideIdx === 0) {
					fireEvent.keyDown(document, {
						key: "ArrowUp",
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

		test("should do nothing if user press the ArrowUp key when at the first slide", () => {
			new Multiscroll();

			const ACTIVE_CLASSNAME = "mys-multiscroll-nav__btn--active";
			const navBtnElements = screen.getAllByRole("button", { name: /to slide \d+/ });
			const totalNavBtnElements = navBtnElements.length;
			const firstNavBtnElement = navBtnElements[0];

			const slideElements = screen.getAllByText(/Slide \d+ (Left|Full)/);
			const totalSlideElements = slideElements.length;
			const firstSlideElement = slideElements[0].parentElement.parentElement;

			fireEvent.keyDown(document, {
				key: "ArrowUp",
			});

			expect(firstNavBtnElement).toHaveClass(ACTIVE_CLASSNAME);

			expect(firstSlideElement).toHaveStyle({ zIndex: 1 });
			expect(firstSlideElement).toHaveAttribute("aria-hidden", "false");

			for (let btnIdx = 1; btnIdx < totalNavBtnElements; btnIdx++) {
				const navBtnElement = navBtnElements[btnIdx];
				expect(navBtnElement).not.toHaveClass(ACTIVE_CLASSNAME);
			}

			for (let slideIdx = 1; slideIdx < totalSlideElements; slideIdx++) {
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

			fireEvent.keyDown(document, {
				key: "ArrowUp",
			});

			const defaultActiveSlideNumber = 0;
			const currentActiveSlideNumber = store.getState().currentActiveSlideNumber;

			expect(currentActiveSlideNumber).toBe(defaultActiveSlideNumber);
		});
	});

	describe("PageUp", () => {
		test("navigate until the first slide and nav buttons, slides and the current active slide number changes accordingly", () => {
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
					fireEvent.keyDown(document, {
						key: "ArrowUp",
					});

					jest.advanceTimersByTime(610);
				}

				if (slideIdx === 0) {
					fireEvent.keyDown(document, {
						key: "PageUp",
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

		test("should do nothing for nav buttons and slides if user press the PageUp key when at the first slide", () => {
			new Multiscroll();

			const ACTIVE_CLASSNAME = "mys-multiscroll-nav__btn--active";
			const navBtnElements = screen.getAllByRole("button", { name: /to slide \d+/ });
			const totalNavBtnElements = navBtnElements.length;
			const firstNavBtnElement = navBtnElements[0];

			const slideElements = screen.getAllByText(/Slide \d+ (Left|Full)/);
			const totalSlideElements = slideElements.length;
			const firstSlideElement = slideElements[0].parentElement.parentElement;

			fireEvent.keyDown(document, {
				key: "ArrowUp",
			});

			expect(firstNavBtnElement).toHaveClass(ACTIVE_CLASSNAME);

			expect(firstSlideElement).toHaveStyle({ zIndex: 1 });
			expect(firstSlideElement).toHaveAttribute("aria-hidden", "false");

			for (let btnIdx = 1; btnIdx < totalNavBtnElements; btnIdx++) {
				const navBtnElement = navBtnElements[btnIdx];
				expect(navBtnElement).not.toHaveClass(ACTIVE_CLASSNAME);
			}

			for (let slideIdx = 1; slideIdx < totalSlideElements; slideIdx++) {
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

			fireEvent.keyDown(document, {
				key: "PageUp",
			});

			const defaultActiveSlideNumber = 0;
			const currentActiveSlideNumber = store.getState().currentActiveSlideNumber;

			expect(currentActiveSlideNumber).toBe(defaultActiveSlideNumber);
		});
	});

	describe("Home", () => {
		test("go to the first slide and nav buttons, slides and the current active slide number changes accordingly", () => {
			new Multiscroll();

			const firstSlideNumber = 0;

			const ACTIVE_CLASSNAME = "mys-multiscroll-nav__btn--active";
			const firstNavBtnElement = screen.getByRole("button", { name: "to slide 0" });
			const firstSlideElement = screen.getByText(/Slide 0 (Left|Full)/).parentElement.parentElement;

			fireEvent.keyDown(document, {
				key: "End",
			});

			jest.advanceTimersByTime(610);

			fireEvent.keyDown(document, {
				key: "Home",
			});

			expect(store.getState().currentActiveSlideNumber).toBe(firstSlideNumber);

			expect(firstNavBtnElement).toHaveClass(ACTIVE_CLASSNAME);

			expect(firstSlideElement).toHaveStyle({ zIndex: 1 });
			expect(firstSlideElement).toHaveAttribute("aria-hidden", "false");
		});

		test("should do nothing if user press the Home key when at the first slide", () => {
			new Multiscroll();

			const firstSlideNumber = 0;

			const ACTIVE_CLASSNAME = "mys-multiscroll-nav__btn--active";
			const navBtnElements = screen.getAllByRole("button", { name: /to slide \d+/ });
			const totalNavBtnElements = navBtnElements.length;
			const firstNavBtnElement = navBtnElements[0];

			const slideElements = screen.getAllByText(/Slide \d+ (Left|Full)/);
			const totalSlideElements = slideElements.length;
			const firstSlideElement = slideElements[0].parentElement.parentElement;

			fireEvent.keyDown(document, {
				key: "Home",
			});

			expect(store.getState().currentActiveSlideNumber).toBe(firstSlideNumber);

			expect(firstNavBtnElement).toHaveClass(ACTIVE_CLASSNAME);

			expect(firstSlideElement).toHaveStyle({ zIndex: 1 });
			expect(firstSlideElement).toHaveAttribute("aria-hidden", "false");

			for (let btnIdx = 1; btnIdx < totalNavBtnElements; btnIdx++) {
				const navBtnElement = navBtnElements[btnIdx];

				if (btnIdx !== totalNavBtnElements - 1) {
					expect(navBtnElement).not.toHaveClass(ACTIVE_CLASSNAME);
				}
			}

			for (let slideIdx = 1; slideIdx < totalSlideElements; slideIdx++) {
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

			fireEvent.keyDown(document, {
				key: "Home",
			});

			const defaultActiveSlideNumber = 0;
			const currentActiveSlideNumber = store.getState().currentActiveSlideNumber;

			expect(currentActiveSlideNumber).toBe(defaultActiveSlideNumber);
		});
	});

	describe("On mobile size", () => {
		test("should do nothing if the current viewport is mobile size", () => {
			const originalInnerWidth = window.innerWidth;

			window.innerWidth = 400;

			new Multiscroll();

			fireEvent.keyDown(document, {
				key: "ArrowDown",
			});

			jest.advanceTimersByTime(610);

			fireEvent.keyDown(document, {
				key: "ArrowUp",
			});

			jest.advanceTimersByTime(610);

			fireEvent.keyDown(document, {
				key: "PageDown",
			});

			jest.advanceTimersByTime(610);

			fireEvent.keyDown(document, {
				key: "PageUp",
			});

			jest.advanceTimersByTime(610);

			fireEvent.keyDown(document, {
				key: "End",
			});

			jest.advanceTimersByTime(610);

			fireEvent.keyDown(document, {
				key: "Home",
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
});
