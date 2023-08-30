// Different behavior when using function expression and declaration in event listener

(function () {
  let currentSlide = 0;
  let transitionDelayTime;
  let isWheelEventDelay = true;
  let isKeyboardEventDelay = true;

  const mobileSize = 992;
  const navDatasetAttribute = "data-slide-nav";
  const slideDatasetAttribute = "data-slide-type";
  const activeNavBtnClassname = "dots-navigate__dot--active";
  const cssVariableTransitionDelay = "--transition-duration";

  const slides = document.getElementsByClassName("slide");
  const navButtons = document.getElementsByClassName("dots-navigate__dot");
  const totalSlides = slides.length;
  const totalNavButtons = navButtons.length;

  function navButtonsFirstRender() {
    for (let index = 0; index < totalNavButtons; index++) {
      const navButton = navButtons[index];

      navButton.setAttribute(navDatasetAttribute, index);
      navButton.setAttribute("aria-label", `to slide ${index + 1}`);
    }
  }

  function slidesFirstRender() {
    const documentEl = document.documentElement;
    const transitionCSSVar = getComputedStyle(documentEl).getPropertyValue(cssVariableTransitionDelay);
    const transitionDelayTimeValue = parseInt(transitionCSSVar);

    transitionDelayTime = transitionDelayTimeValue;

    for (let index = 0; index < totalSlides; index++) {
      const slide = slides[index];
      const leftSlideContent = slide.firstElementChild;
      const rightSlideContent = slide.lastElementChild;
      const totalSlideContent = slide.childElementCount;

      if (totalSlideContent === 1) {
        slide.setAttribute(slideDatasetAttribute, "full");
        leftSlideContent.style.transform = `translateY(${index}00%)`;
      }

      if (totalSlideContent === 2) {
        slide.setAttribute(slideDatasetAttribute, "multi");
        leftSlideContent.style.transform = `translateY(${index}00%)`;
        rightSlideContent.style.transform = `translateY(-${index}00%)`;
      }

      if (window.innerWidth > mobileSize) {
        slide.style.zIndex = "1";

        for (let index = 0; index < totalSlides; index++) {
          const slide = slides[index];

          if (index === 0) {
            slide.setAttribute("aria-hidden", false);
          }

          if (index !== 0) {
            slide.setAttribute("aria-hidden", true);
          }
        }
      }

      if (window.innerWidth < mobileSize) {
        for (let index = 0; index < totalSlides; index++) {
          const slide = slides[index];
          slide.removeAttribute("aria-hidden");
        }
      }
    }
  }

  function setAriaHiddenWhileResizing() {
    if (window.innerWidth > mobileSize) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      slides[currentSlide].style.zIndex = "1";

      for (let index = 0; index < totalSlides; index++) {
        const slide = slides[index];

        if (currentSlide === index) {
          slide.setAttribute("aria-hidden", false);
        }

        if (currentSlide !== index) {
          slide.setAttribute("aria-hidden", true);
        }
      }
    } else {
      slides[currentSlide].style.zIndex = "";

      for (let index = 0; index < totalSlides; index++) {
        const slide = slides[index];
        slide.removeAttribute("aria-hidden");
      }
    }
  }

  function navigateNavButtons() {
    for (let index = 0; index < totalNavButtons; index++) {
      const navButton = navButtons[index];

      navButton.addEventListener("click", () => {
        if (isWheelEventDelay === true) {
          const slideNavNumber = navButton.getAttribute(navDatasetAttribute);
          const slideSelected = parseInt(slideNavNumber);
          const slideComparison = Math.abs(currentSlide - slideSelected);

          if (slideComparison === 1) {
            if (currentSlide + 1 === slideSelected) {
              oneTimeNavigate("bottom");
            }

            if (currentSlide - 1 === slideSelected) {
              oneTimeNavigate("top");
            }
          }

          if (slideComparison > 1) {
            if (currentSlide !== totalSlides - 1 && slideSelected > currentSlide) {
              multipleTimeNavigate("bottom", slideComparison, slideSelected);
            }

            if (currentSlide !== 0 && slideSelected < currentSlide) {
              multipleTimeNavigate("top", slideComparison, slideSelected);
            }
          }
        }
      });
    }
  }

  function navigateMouseScroll(event) {
    if (isWheelEventDelay === true) {
      if (window.innerWidth > mobileSize) {
        const scrollValue = event.deltaY;

        if (currentSlide !== totalSlides - 1 && scrollValue > 0) {
          oneTimeNavigate("bottom");
        }

        if (currentSlide !== 0 && scrollValue < 0) {
          oneTimeNavigate("top");
        }
      }
    }
  }

  function navigateKeyboard(event) {
    if (window.innerWidth >= mobileSize) {
      if (isKeyboardEventDelay === true) {
        const keyboardKey = event.key.toLowerCase();

        isKeyboardEventDelay = false;

        if (currentSlide !== totalSlides - 1 && keyboardKey === "end") {
          const slideComparison = Math.abs(currentSlide - totalSlides);

          multipleTimeNavigate("bottom", slideComparison, totalSlides);
        }

        if (currentSlide !== 0 && keyboardKey === "home") {
          const slideComparison = Math.abs(currentSlide - 1);

          multipleTimeNavigate("top", slideComparison, 1);
        }

        if (keyboardKey === "arrowdown" || keyboardKey === "pagedown") {
          if (currentSlide !== totalSlides - 1) {
            oneTimeNavigate("bottom");
          }
        }

        if (keyboardKey === "arrowup" || keyboardKey === "pageup") {
          if (currentSlide !== 0) {
            oneTimeNavigate("top");
          }
        }

        setTimeout(() => {
          isKeyboardEventDelay = true;
        }, transitionDelayTime);
      }
    }
  }

  function oneTimeNavigate(direction) {
    isWheelEventDelay = false;

    for (let index = 0; index < totalSlides; index++) {
      const slideType = slides[index].getAttribute(slideDatasetAttribute);

      if (slideType === "multi") {
        const leftSlide = slides[index].firstElementChild;
        const rightSlide = slides[index].lastElementChild;
        const translateYLeftSlide = parseInt(leftSlide.style.transform.replace(/[^-\d.]/g, ""));
        const translateYRightSlide = parseInt(rightSlide.style.transform.replace(/[^-\d.]/g, ""));

        if (direction === "bottom") {
          leftSlide.style.transform = `translateY(${translateYLeftSlide - 100}%)`;
          rightSlide.style.transform = `translateY(${translateYRightSlide + 100}%)`;
        }

        if (direction === "top") {
          leftSlide.style.transform = `translateY(${translateYLeftSlide + 100}%)`;
          rightSlide.style.transform = `translateY(${translateYRightSlide - 100}%)`;
        }
      }

      if (slideType === "full") {
        const fullSlide = slides[index].firstElementChild;
        const translateYFullSlide = parseInt(fullSlide.style.transform.replace(/[^-\d.]/g, ""));

        if (direction === "bottom") {
          fullSlide.style.transform = `translateY(${translateYFullSlide - 100}%)`;
        }

        if (direction === "top") {
          fullSlide.style.transform = `translateY(${translateYFullSlide + 100}%)`;
        }
      }
    }

    slides[currentSlide].style.zIndex = "";
    slides[currentSlide].setAttribute("aria-hidden", true);

    if (direction === "bottom") {
      slides[currentSlide].nextElementSibling.setAttribute("aria-hidden", false);
      navButtons[currentSlide].classList.remove(activeNavBtnClassname);
      currentSlide += 1;
    }

    if (direction === "top") {
      slides[currentSlide].previousElementSibling.setAttribute("aria-hidden", false);
      navButtons[currentSlide].classList.remove(activeNavBtnClassname);
      currentSlide -= 1;
    }

    navButtons[currentSlide].classList.add(activeNavBtnClassname);
    navButtons[currentSlide].focus();

    setTimeout(() => {
      slides[currentSlide].style.zIndex = "1";
      isWheelEventDelay = true;
    }, transitionDelayTime);
  }

  function multipleTimeNavigate(direction, slideComparison, choosenSlide) {
    isWheelEventDelay = false;
    slides[currentSlide].style.zIndex = "";

    for (let index = 0; index < slideComparison; index++) {
      for (let innerIndex = 0; innerIndex < totalSlides; innerIndex++) {
        const slide = slides[innerIndex];
        const slideType = slide.getAttribute(slideDatasetAttribute);

        if (slideType === "multi") {
          const leftSlide = slide.firstElementChild;
          const rightSlide = slide.lastElementChild;
          const translateYLeftSlide = parseInt(leftSlide.style.transform.replace(/[^-\d.]/g, ""));
          const translateYRightSlide = parseInt(rightSlide.style.transform.replace(/[^-\d.]/g, ""));

          if (direction === "top") {
            leftSlide.style.transform = `translateY(${translateYLeftSlide + 100}%)`;
            rightSlide.style.transform = `translateY(${translateYRightSlide - 100}%)`;
          }

          if (direction === "bottom") {
            leftSlide.style.transform = `translateY(${translateYLeftSlide - 100}%)`;
            rightSlide.style.transform = `translateY(${translateYRightSlide + 100}%)`;
          }
        }

        if (slideType === "full") {
          const fullSlide = slides[innerIndex].firstElementChild;
          const translateYFullSlide = parseInt(fullSlide.style.transform.replace(/[^-\d.]/g, ""));

          if (direction === "top") {
            fullSlide.style.transform = `translateY(${translateYFullSlide + 100}%)`;
          }

          if (direction === "bottom") {
            fullSlide.style.transform = `translateY(${translateYFullSlide - 100}%)`;
          }
        }
      }
    }

    slides[choosenSlide].setAttribute("aria-hidden", false);
    slides[currentSlide].setAttribute("aria-hidden", true);
    navButtons[currentSlide].classList.remove(activeNavBtnClassname);

    currentSlide = choosenSlide;

    navButtons[currentSlide].classList.add(activeNavBtnClassname);
    navButtons[currentSlide].focus();

    setTimeout(() => {
      slides[currentSlide].style.zIndex = "1";
      isWheelEventDelay = true;
    }, transitionDelayTime);
  }

  window.addEventListener("load", navButtonsFirstRender);
  window.addEventListener("load", slidesFirstRender);
  window.addEventListener("resize", setAriaHiddenWhileResizing);
  window.addEventListener("keydown", navigateKeyboard);
  window.addEventListener("wheel", navigateMouseScroll);

  navigateNavButtons();
})();
