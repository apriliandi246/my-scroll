import "@testing-library/jest-dom";

import setupCSS from "../../utils/setupCSS.js";
import setupHTML from "../../utils/setupHTML.js";
import setupStore from "../../utils/setupStore.js";
import Multiscroll from "../../../dekstop/multiscroll/javascript/Multiscroll.js";

beforeEach(() => {
	setupHTML();
	setupCSS();
	setupStore();
});

describe("Slide", () => {
	test("slides doesn't have aria-hidden attribute if the current viewport is mobile size", () => {
		const originalInnerWidth = window.innerWidth;

		window.innerWidth = 400;

		new Multiscroll();

		const slideElements = document.getElementsByClassName("mys-multiscroll-slide");

		for (let slideIdx = 0; slideIdx < slideElements.length; slideIdx++) {
			const slide = slideElements[slideIdx];
			expect(slide).not.toHaveAttribute("aria-hidden");
		}

		// Restore the original window.innerWidth
		window.innerWidth = originalInnerWidth;
	});

	test("slides doesn't z-index inline style if the current viewport is mobile size", () => {
		const originalInnerWidth = window.innerWidth;

		window.innerWidth = 400;

		new Multiscroll();

		const slideElements = document.getElementsByClassName("mys-multiscroll-slide");

		for (let slideIdx = 0; slideIdx < slideElements.length; slideIdx++) {
			const slide = slideElements[slideIdx];
			expect(slide).not.toHaveStyle({ zIndex: 1 });
		}

		// Restore the original window.innerWidth
		window.innerWidth = originalInnerWidth;
	});
});
