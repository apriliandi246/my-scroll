function isSlideElementHasZindex(slideElement) {
	const isSlideHasZindex = slideElement.style.getPropertyValue("z-index") === "" ? false : true;

	return isSlideHasZindex;
}

export default isSlideElementHasZindex;
