import { fireEvent, prettyDOM } from "@testing-library/dom";

import Multiscroll from "../../dekstop/multiscroll/javascript/Multiscroll.js";

import setupCSS from "../utils/setupCSS.js";
import setupHTML from "../utils/setupHTML.js";
import setupStore from "../utils/setupStore.js";
import getAriaHiddenAttr from "../utils/getAriaHiddenAttr.js";
import isHasNoAriaHiddenAttr from "../utils/isHasNoAriaHiddenAttr.js";
import isSlideElementHasZindex from "../utils/isSlideElementHasZindex.js";

beforeEach(() => {
	setupCSS();
	setupHTML();
	setupStore();

	jest.useFakeTimers();
});

afterEach(() => {
	jest.useRealTimers();
});

describe("Slide", () => {
	describe("Mobile view - there is no important attributes when comes to mobile view for the slides (aria hidden equal false and z-index inline style)", () => {
		test("check the important attributes for all slides", () => {
			const originalInnerWidth = window.innerWidth;

			window.innerWidth = 400;

			new Multiscroll();

			const slideElements = document.getElementsByClassName("mys-multiscroll-slide");
			const totalSlideElements = slideElements.length - 1;

			for (let slideIdx = 0; slideIdx < totalSlideElements; slideIdx++) {
				const slide = slideElements[slideIdx];

				expect(isHasNoAriaHiddenAttr(slide)).toBe(true);
				expect(isSlideElementHasZindex(slide)).toBe(false);
			}

			// Restore the original window.innerWidth
			window.innerWidth = originalInnerWidth;
		});
	});

	describe("Resizing window and check the active slide for dekstop and mobile view", () => {
		test("check on mobile view", () => {
			const mockFunc = jest.fn();
			const originalInnerWidth = window.innerWidth;

			window.innerWidth = 400;

			new Multiscroll();

			window.addEventListener("resize", mockFunc);

			fireEvent.resize(window);

			jest.advanceTimersByTime(300);

			const slideElements = document.getElementsByClassName("mys-multiscroll-slide");
			const totalSlideElements = slideElements.length - 1;

			for (let slideIdx = 0; slideIdx < totalSlideElements; slideIdx++) {
				const slide = slideElements[slideIdx];

				expect(isHasNoAriaHiddenAttr(slide)).toBe(true);
				expect(isSlideElementHasZindex(slide)).toBe(false);
			}

			// Restore the original window.innerWidth
			window.innerWidth = originalInnerWidth;
		});

		test("Check on dekstop view", () => {
			const mockFunc = jest.fn();

			new Multiscroll();

			window.addEventListener("resize", mockFunc);

			fireEvent.resize(window);

			jest.advanceTimersByTime(300);

			const firstSlideElement = document.querySelector(".mys-multiscroll-slide:first-child");

			expect(getAriaHiddenAttr(firstSlideElement)).toBe(false);
			expect(isSlideElementHasZindex(firstSlideElement)).toBe(true);
		});
	});
});
