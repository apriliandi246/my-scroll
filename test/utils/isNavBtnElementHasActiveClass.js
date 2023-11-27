function isNavBtnElementHasActiveClass(btnElement) {
	const ACTIVE_CLASSNAME = "mys-multiscroll-nav__btn--active";
	const isBtnElementHasActiveClass = btnElement.classList.contains(ACTIVE_CLASSNAME) ? true : false;

	return isBtnElementHasActiveClass;
}

export default isNavBtnElementHasActiveClass;
