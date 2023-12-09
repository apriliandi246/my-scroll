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
		test("go to the next slide and the nav button and slide changes accordingly", () => {
			new Multiscroll();

			const ACTIVE_CLASSNAME = "mys-multiscroll-nav__btn--active";
			const nextNavBtnElement = screen.getByRole("button", { name: "to slide 1" });

			const nextSlideElement = screen.getByText(/Slide 1 (Left|Full)/).parentElement.parentElement;

			fireEvent.keyDown(document, {
				key: "ArrowDown",
			});

			expect(nextNavBtnElement).toHaveClass(ACTIVE_CLASSNAME);

			expect(nextSlideElement).toHaveStyle({ zIndex: 1 });
			expect(nextSlideElement).toHaveAttribute("aria-hidden", "false");
		});

		test("go to the next slide and previous slide become unactive and the nav button and slide changes accordingly", () => {
			new Multiscroll();

			const ACTIVE_CLASSNAME = "mys-multiscroll-nav__btn--active";
			const prevNavBtnElement = screen.getByRole("button", { name: "to slide 0" });
			const nextNavBtnElement = screen.getByRole("button", { name: "to slide 1" });

			const prevSlideElement = screen.getByText(/Slide 0 (Left|Full)/).parentElement.parentElement;
			const nextSlideElement = screen.getByText(/Slide 1 (Left|Full)/).parentElement.parentElement;

			fireEvent.keyDown(document, {
				key: "ArrowDown",
			});

			expect(prevNavBtnElement).not.toHaveClass(ACTIVE_CLASSNAME);
			expect(nextNavBtnElement).toHaveClass(ACTIVE_CLASSNAME);

			expect(prevSlideElement).not.toHaveStyle({ zIndex: 1 });
			expect(prevSlideElement).toHaveAttribute("aria-hidden", "true");

			expect(nextSlideElement).toHaveStyle({ zIndex: 1 });
			expect(nextSlideElement).toHaveAttribute("aria-hidden", "false");
		});

		test("go to the next slide until at the last slide and the nav buttons and slide changes accordingly", () => {
			new Multiscroll();

			const ACTIVE_CLASSNAME = "mys-multiscroll-nav__btn--active";
			const slideElements = screen.getAllByText(/Slide \d+ (Left|Full)/);
			const totalSlides = slideElements.length;

			for (let slideIdx = 1; slideIdx < totalSlides; slideIdx++) {
				const prevSlideElement = slideElements[slideIdx - 1].parentElement.parentElement;
				const nextSlideElement = slideElements[slideIdx].parentElement.parentElement;

				const prevNavBtnElement = screen.getByRole("button", { name: `to slide ${slideIdx - 1}` });
				const nextNavBtnElement = screen.getByRole("button", { name: `to slide ${slideIdx}` });

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

				expect(prevNavBtnElement).not.toHaveClass(ACTIVE_CLASSNAME);
				expect(nextNavBtnElement).toHaveClass(ACTIVE_CLASSNAME);

				expect(prevSlideElement).not.toHaveStyle({ zIndex: 1 });
				expect(prevSlideElement).toHaveAttribute("aria-hidden", "true");

				expect(nextSlideElement).toHaveStyle({ zIndex: 1 });
				expect(nextSlideElement).toHaveAttribute("aria-hidden", "false");
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
	});

	describe("PageDown", () => {
		test("go to the next slide and the nav button and slide changes accordingly", () => {
			new Multiscroll();

			const ACTIVE_CLASSNAME = "mys-multiscroll-nav__btn--active";
			const nextNavBtnElement = screen.getByRole("button", { name: "to slide 1" });

			const nextSlideElement = screen.getByText(/Slide 1 (Left|Full)/).parentElement.parentElement;

			fireEvent.keyDown(document, {
				key: "ArrowDown",
			});

			expect(nextNavBtnElement).toHaveClass(ACTIVE_CLASSNAME);

			expect(nextSlideElement).toHaveStyle({ zIndex: 1 });
			expect(nextSlideElement).toHaveAttribute("aria-hidden", "false");
		});

		test("go to the next slide and previous slide become unactive and the nav button and slide changes accordingly", () => {
			new Multiscroll();

			const ACTIVE_CLASSNAME = "mys-multiscroll-nav__btn--active";
			const prevNavBtnElement = screen.getByRole("button", { name: "to slide 0" });
			const nextNavBtnElement = screen.getByRole("button", { name: "to slide 1" });

			const prevSlideElement = screen.getByText(/Slide 0 (Left|Full)/).parentElement.parentElement;
			const nextSlideElement = screen.getByText(/Slide 1 (Left|Full)/).parentElement.parentElement;

			fireEvent.keyDown(document, {
				key: "ArrowDown",
			});

			expect(prevNavBtnElement).not.toHaveClass(ACTIVE_CLASSNAME);
			expect(nextNavBtnElement).toHaveClass(ACTIVE_CLASSNAME);

			expect(prevSlideElement).not.toHaveStyle({ zIndex: 1 });
			expect(prevSlideElement).toHaveAttribute("aria-hidden", "true");

			expect(nextSlideElement).toHaveStyle({ zIndex: 1 });
			expect(nextSlideElement).toHaveAttribute("aria-hidden", "false");
		});

		test("go to the next slide until at the last slide and the nav buttons and slide changes accordingly", () => {
			new Multiscroll();

			const ACTIVE_CLASSNAME = "mys-multiscroll-nav__btn--active";
			const slideElements = screen.getAllByText(/Slide \d+ (Left|Full)/);
			const totalSlides = slideElements.length;

			for (let slideIdx = 1; slideIdx < totalSlides; slideIdx++) {
				const prevSlideElement = slideElements[slideIdx - 1].parentElement.parentElement;
				const nextSlideElement = slideElements[slideIdx].parentElement.parentElement;

				const prevNavBtnElement = screen.getByRole("button", { name: `to slide ${slideIdx - 1}` });
				const nextNavBtnElement = screen.getByRole("button", { name: `to slide ${slideIdx}` });

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

				expect(prevNavBtnElement).not.toHaveClass(ACTIVE_CLASSNAME);
				expect(nextNavBtnElement).toHaveClass(ACTIVE_CLASSNAME);

				expect(prevSlideElement).not.toHaveStyle({ zIndex: 1 });
				expect(prevSlideElement).toHaveAttribute("aria-hidden", "true");

				expect(nextSlideElement).toHaveStyle({ zIndex: 1 });
				expect(nextSlideElement).toHaveAttribute("aria-hidden", "false");
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
	});

	describe("End", () => {
		test("go to the last slide and the nav buttons and slides changes accordingly", () => {
			new Multiscroll();

			const ACTIVE_CLASSNAME = "mys-multiscroll-nav__btn--active";
			const lastNavBtnElement = screen.getByRole("button", { name: "to slide 11" });
			const lastSlideElement = screen.getByText(/Slide 11 (Left|Full)/).parentElement.parentElement;

			fireEvent.keyDown(document, {
				key: "End",
			});

			expect(lastNavBtnElement).toHaveClass(ACTIVE_CLASSNAME);

			expect(lastSlideElement).toHaveStyle({ zIndex: 1 });
			expect(lastSlideElement).toHaveAttribute("aria-hidden", "false");
		});

		test("should do nothing for nav buttons and slides if user press the End key when at the last slide", () => {
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
	});

	describe("ArrowUp", () => {
		test("go to the previous slide and the nav button and slide changes accordingly", () => {
			new Multiscroll();

			const ACTIVE_CLASSNAME = "mys-multiscroll-nav__btn--active";
			const prevNavBtnElement = screen.getByRole("button", { name: "to slide 0" });

			const prevSlideElement = screen.getByText(/Slide 0 (Left|Full)/).parentElement.parentElement;

			fireEvent.keyDown(document, {
				key: "ArrowDown",
			});

			jest.advanceTimersByTime(610);

			fireEvent.keyDown(document, {
				key: "ArrowUp",
			});

			expect(prevNavBtnElement).toHaveClass(ACTIVE_CLASSNAME);

			expect(prevSlideElement).toHaveStyle({ zIndex: 1 });
			expect(prevSlideElement).toHaveAttribute("aria-hidden", "false");
		});

		test("go to the previous slide and the next slide become unactive and the nav button and slide changes accordingly", () => {
			new Multiscroll();

			const ACTIVE_CLASSNAME = "mys-multiscroll-nav__btn--active";
			const prevNavBtnElement = screen.getByRole("button", { name: "to slide 0" });
			const nextNavBtnElement = screen.getByRole("button", { name: "to slide 1" });

			const previousSlideElement = screen.getByText(/Slide 0 (Left|Full)/).parentElement.parentElement;
			const nextSlideElement = screen.getByText(/Slide 1 (Left|Full)/).parentElement.parentElement;

			fireEvent.keyDown(document, {
				key: "ArrowDown",
			});

			jest.advanceTimersByTime(610);

			fireEvent.keyDown(document, {
				key: "ArrowUp",
			});

			expect(nextNavBtnElement).not.toHaveClass(ACTIVE_CLASSNAME);
			expect(prevNavBtnElement).toHaveClass(ACTIVE_CLASSNAME);

			expect(nextSlideElement).not.toHaveStyle({ zIndex: 1 });
			expect(nextSlideElement).toHaveAttribute("aria-hidden", "true");

			expect(previousSlideElement).toHaveStyle({ zIndex: 1 });
			expect(previousSlideElement).toHaveAttribute("aria-hidden", "false");
		});

		test("go to the next slide until at the first slide and the nav buttons and slide changes accordingly", () => {
			new Multiscroll();

			const ACTIVE_CLASSNAME = "mys-multiscroll-nav__btn--active";
			const slideElements = screen.getAllByText(/Slide \d+ (Left|Full)/);
			const totalSlides = slideElements.length;

			fireEvent.keyDown(document, {
				key: "End",
			});

			jest.advanceTimersByTime(610);

			for (let slideIdx = totalSlides - 1; slideIdx >= 0; slideIdx--) {
				if (slideIdx !== 1) {
					fireEvent.keyDown(document, {
						key: "ArrowUp",
					});

					jest.advanceTimersByTime(610);
				}

				if (slideIdx === 1) {
					fireEvent.keyDown(document, {
						key: "ArrowUp",
					});
				}

				if (slideIdx !== 0) {
					const slideElement = slideElements[slideIdx - 1].parentElement.parentElement;
					const prevNavBtnElement = screen.getByRole("button", { name: `to slide ${slideIdx}` });
					const nextNavBtnElement = screen.getByRole("button", { name: `to slide ${slideIdx - 1}` });

					expect(slideElement).toHaveStyle({ zIndex: 1 });
					expect(slideElement).toHaveAttribute("aria-hidden", "false");

					expect(prevNavBtnElement).not.toHaveClass(ACTIVE_CLASSNAME);
					expect(nextNavBtnElement).toHaveClass(ACTIVE_CLASSNAME);
				}
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
	});

	describe("PageUp", () => {
		test("go to the previous slide and the nav button and slide changes accordingly", () => {
			new Multiscroll();

			const ACTIVE_CLASSNAME = "mys-multiscroll-nav__btn--active";
			const prevNavBtnElement = screen.getByRole("button", { name: "to slide 0" });

			const prevSlideElement = screen.getByText(/Slide 0 (Left|Full)/).parentElement.parentElement;

			fireEvent.keyDown(document, {
				key: "ArrowDown",
			});

			jest.advanceTimersByTime(610);

			fireEvent.keyDown(document, {
				key: "ArrowUp",
			});

			expect(prevNavBtnElement).toHaveClass(ACTIVE_CLASSNAME);

			expect(prevSlideElement).toHaveStyle({ zIndex: 1 });
			expect(prevSlideElement).toHaveAttribute("aria-hidden", "false");
		});

		test("go to the previous slide and the next slide become unactive and the nav button and slide changes accordingly", () => {
			new Multiscroll();

			const ACTIVE_CLASSNAME = "mys-multiscroll-nav__btn--active";
			const prevNavBtnElement = screen.getByRole("button", { name: "to slide 0" });
			const nextNavBtnElement = screen.getByRole("button", { name: "to slide 1" });

			const previousSlideElement = screen.getByText(/Slide 0 (Left|Full)/).parentElement.parentElement;
			const nextSlideElement = screen.getByText(/Slide 1 (Left|Full)/).parentElement.parentElement;

			fireEvent.keyDown(document, {
				key: "ArrowDown",
			});

			jest.advanceTimersByTime(610);

			fireEvent.keyDown(document, {
				key: "ArrowUp",
			});

			expect(nextNavBtnElement).not.toHaveClass(ACTIVE_CLASSNAME);
			expect(prevNavBtnElement).toHaveClass(ACTIVE_CLASSNAME);

			expect(nextSlideElement).not.toHaveStyle({ zIndex: 1 });
			expect(nextSlideElement).toHaveAttribute("aria-hidden", "true");

			expect(previousSlideElement).toHaveStyle({ zIndex: 1 });
			expect(previousSlideElement).toHaveAttribute("aria-hidden", "false");
		});

		test("go to the next slide until at the first slide and the nav buttons and slide changes accordingly", () => {
			new Multiscroll();

			const ACTIVE_CLASSNAME = "mys-multiscroll-nav__btn--active";
			const slideElements = screen.getAllByText(/Slide \d+ (Left|Full)/);
			const totalSlides = slideElements.length;

			fireEvent.keyDown(document, {
				key: "End",
			});

			jest.advanceTimersByTime(610);

			for (let slideIdx = totalSlides - 1; slideIdx >= 0; slideIdx--) {
				if (slideIdx !== 1) {
					fireEvent.keyDown(document, {
						key: "ArrowUp",
					});

					jest.advanceTimersByTime(610);
				}

				if (slideIdx === 1) {
					fireEvent.keyDown(document, {
						key: "ArrowUp",
					});
				}

				if (slideIdx !== 0) {
					const slideElement = slideElements[slideIdx - 1].parentElement.parentElement;
					const prevNavBtnElement = screen.getByRole("button", { name: `to slide ${slideIdx}` });
					const nextNavBtnElement = screen.getByRole("button", { name: `to slide ${slideIdx - 1}` });

					expect(slideElement).toHaveStyle({ zIndex: 1 });
					expect(slideElement).toHaveAttribute("aria-hidden", "false");

					expect(prevNavBtnElement).not.toHaveClass(ACTIVE_CLASSNAME);
					expect(nextNavBtnElement).toHaveClass(ACTIVE_CLASSNAME);
				}
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
	});

	describe("Home", () => {
		test("go to the first slide and the nav buttons and slides changes accordingly", () => {
			new Multiscroll();

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

			expect(firstNavBtnElement).toHaveClass(ACTIVE_CLASSNAME);

			expect(firstSlideElement).toHaveStyle({ zIndex: 1 });
			expect(firstSlideElement).toHaveAttribute("aria-hidden", "false");
		});

		test("should do nothing if user press the Home key when at the first slide", () => {
			new Multiscroll();

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
	});

	describe("On mobile size", () => {
		test("should do nothing for slides if the current viewport is mobile size", () => {
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

			const slideElements = screen.getAllByText(/Slide \d+ (Left|Full)/);

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
