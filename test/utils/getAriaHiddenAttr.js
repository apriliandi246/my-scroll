function getAriaHiddenAttr(element) {
	const elementAriaHiddenAttr = element.getAttribute("aria-hidden").toLowerCase();

	if (elementAriaHiddenAttr === "true") {
		return true;
	}

	if (elementAriaHiddenAttr === "false") {
		return false;
	}
}

export default getAriaHiddenAttr;
