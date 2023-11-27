function isHasNoAriaHiddenAttr(element) {
	return element.getAttribute("aria-hidden") === null ? true : false;
}

export default isHasNoAriaHiddenAttr;
