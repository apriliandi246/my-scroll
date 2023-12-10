/* 
	https://github.com/apriliandi246/state-of-shit 
*/

"use strict";

function createStore(mainState, modifier) {
	if (isJustObject(mainState) === false) {
		throw new Error("Just using plain object for the main state");
	}

	if (isObjectEmpty(mainState) === true) {
		throw new Error("Where the hell is your properties of state in your main state object");
	}

	if (typeof modifier !== "function") {
		throw new Error("Just using plain function for the state modifier");
	}

	let isMutating = false;

	function getState() {
		/*
			🕵️‍♂️
		*/
		if (isMutating === true) return;

		return Object.freeze(mainState);
	}

	function setState(payload) {
		/*
			🕵️‍♂️
		*/
		if (isMutating === true) return;

		if (isJustObject(payload) === false) {
			throw new Error("Just using plain object for the payload");
		}

		const nextState = modifier({ ...mainState }, payload);

		if (isJustObject(nextState) === false) {
			throw new Error("Where is the return of object state from your state modifier?");
		}

		mainState = nextState;
	}

	function isJustObject(obj) {
		if (typeof obj !== "object") return false;

		const proto = Object.getPrototypeOf(obj);
		const isPlainObject = proto !== null && Object.getPrototypeOf(proto) === null;

		return isPlainObject;
	}

	function isObjectEmpty(obj) {
		const objProperties = Object.keys(obj);

		if (objProperties.length === 0) {
			return true;
		} else {
			return false;
		}
	}

	return {
		setState,
		getState,
	};
}

const mainState = {
	isSlideNavigating: false,
	currentActiveSlideNumber: 0,
};

function stateModifier(state, payload) {
	const { type, values } = payload;

	if (type === "SLIDING-PROCESS") {
		state.isSlideNavigating = values.isSlideNavigating;
	}

	if (type === "ACTIVE-SLIDE") {
		state.currentActiveSlideNumber = values.currentActiveSlideNumber;
	}

	return state;
}

const store = createStore(mainState, stateModifier);

export default store;
