/*
  💡 issue with navigate slide using button navigation and after using wheel event.
    => slide becomes not predictable and not in correct position
*/

class MultiScroll {
  constructor(mobileSize) {
    this.currentSlide = 0;
    this.mobileSize = mobileSize;
    this.isWheelEventDelay = true;
    this.isKeyboardEventDelay = true;
    this.navDatasetAttribute = "data-slide-nav";
    this.slideDatasetAttribute = "data-slide-type";
    this.activeNavBtnClassname = "dots-navigate__dot--active";
    this.cssVariableTransitionDelay = "--transition-duration";
    this.slides = document.getElementsByClassName("slide");
    this.navButtons = document.getElementsByClassName("dots-navigate__dot");
    this.totalSlides = this.slides.length;
    this.totalNavButtons = this.navButtons.length;
    this.transitionDelayTime;

    this.controller = new AbortController();

    this.triggerFunctionalities();
  }

  triggerFunctionalities() {
    this.slidesFirstRender();
    this.navButtonsFirstRender();
    this.navigateMouseScroll();
    this.navigateKeyboard();
    this.navigateNavButtons();
    this.setAriaHiddenWhileResizing();
  }

  navButtonsFirstRender() {
    for (let index = 0; index < this.totalNavButtons; index++) {
      const navButton = this.navButtons[index];

      navButton.setAttribute(this.navDatasetAttribute, index);
      navButton.setAttribute("aria-label", `to slide ${index}`);
    }
  }

  slidesFirstRender() {
    const documentEl = document.documentElement;
    const transitionCSSVar = getComputedStyle(documentEl).getPropertyValue(this.cssVariableTransitionDelay);
    const transitionDelayTime = parseInt(transitionCSSVar);

    this.transitionDelayTime = transitionDelayTime;

    for (let index = 0; index < this.totalSlides; index++) {
      const slide = this.slides[index];
      const leftSlideContent = slide.firstElementChild;
      const rightSlideContent = slide.lastElementChild;
      const totalSlideContent = slide.childElementCount;

      if (totalSlideContent === 1) {
        slide.setAttribute(this.slideDatasetAttribute, "full");
        leftSlideContent.style.transform = `translateY(${index}00%)`;
      }

      if (totalSlideContent === 2) {
        slide.setAttribute(this.slideDatasetAttribute, "multi");
        leftSlideContent.style.transform = `translateY(${index}00%)`;
        rightSlideContent.style.transform = `translateY(-${index}00%)`;
      }

      if (window.innerWidth > this.mobileSize) {
        this.slides[0].style.zIndex = "1";

        for (let index = 0; index < this.totalSlides; index++) {
          const slide = this.slides[index];

          if (index === 0) {
            slide.setAttribute("aria-hidden", false);
          }

          if (index !== 0) {
            slide.setAttribute("aria-hidden", true);
          }
        }
      }

      if (window.innerWidth < this.mobileSize) {
        for (let index = 0; index < this.totalSlides; index++) {
          const slide = this.slides[index];

          slide.removeAttribute("aria-hidden");
        }
      }
    }
  }

  setAriaHiddenWhileResizing() {
    window.addEventListener("resize", () => {
      if (window.innerWidth > this.mobileSize) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        this.slides[this.currentSlide].style.zIndex = "1";

        for (let index = 0; index < this.totalSlides; index++) {
          const slide = this.slides[index];

          if (this.currentSlide === index) {
            slide.setAttribute("aria-hidden", false);
          }

          if (this.currentSlide !== index) {
            slide.setAttribute("aria-hidden", true);
          }
        }
      } else {
        this.slides[this.currentSlide].style.zIndex = "";

        for (let index = 0; index < this.totalSlides; index++) {
          const slide = this.slides[index];

          slide.removeAttribute("aria-hidden");
        }
      }
    });
  }

  navigateNavButtons() {
    for (let index = 0; index < this.totalNavButtons; index++) {
      const navButton = this.navButtons[index];

      navButton.addEventListener("click", () => {
        if (this.isWheelEventDelay === true) {
          if (window.innerWidth > this.mobileSize) {
            const slideNavNumber = navButton.getAttribute(this.navDatasetAttribute);
            const slideSelected = parseInt(slideNavNumber);
            const slideComparison = Math.abs(this.currentSlide - slideSelected);

            if (slideComparison === 1) {
              if (this.currentSlide + 1 === slideSelected) {
                this.oneTimeNavigate("bottom");
              }

              if (this.currentSlide - 1 === slideSelected) {
                this.oneTimeNavigate("top");
              }
            }

            if (slideComparison > 1) {
              if (this.currentSlide !== this.totalSlides - 1 && slideSelected > this.currentSlide) {
                this.multipleTimeNavigate("bottom", slideComparison, slideSelected);
              }

              if (this.currentSlide !== 0 && slideSelected < this.currentSlide) {
                this.multipleTimeNavigate("top", slideComparison, slideSelected);
              }
            }
          }
        }

        return;
      });
    }
  }

  navigateMouseScroll() {
    const wheelHandler = (event) => {
      if (this.isWheelEventDelay === true) {
        if (window.innerWidth > this.mobileSize) {
          const scrollValue = event.deltaY;

          if (this.currentSlide !== 0 && scrollValue < 0) {
            this.oneTimeNavigate("top");
          }

          if (this.currentSlide !== this.totalSlides - 1 && scrollValue > 0) {
            this.oneTimeNavigate("bottom");
          }
        }
      }
    };

    window.addEventListener("wheel", wheelHandler, { passive: true });
  }

  navigateKeyboard() {
    window.addEventListener("keydown", (event) => {
      if (window.innerWidth >= this.mobileSize) {
        if (this.isKeyboardEventDelay === true) {
          const keyboardKey = event.key.toLowerCase();

          this.isKeyboardEventDelay = false;

          if (this.currentSlide !== this.totalSlides - 1 && keyboardKey === "end") {
            const slideComparison = Math.abs(this.currentSlide - this.totalSlides);

            this.multipleTimeNavigate("bottom", slideComparison, this.totalSlides);
          }

          if (this.currentSlide !== 0 && keyboardKey === "home") {
            const slideComparison = Math.abs(this.currentSlide - 1);

            this.multipleTimeNavigate("top", slideComparison, 1);
          }

          if (keyboardKey === "arrowdown" || keyboardKey === "pagedown") {
            if (this.currentSlide !== this.totalSlides - 1) {
              this.oneTimeNavigate("bottom");
            }
          }

          if (keyboardKey === "arrowup" || keyboardKey === "pageup") {
            if (this.currentSlide !== 0) {
              this.oneTimeNavigate("top");
            }
          }

          setTimeout(() => {
            this.isKeyboardEventDelay = true;
          }, this.transitionDelayTime);
        }
      }
    });
  }

  oneTimeNavigate(direction) {
    this.isWheelEventDelay = false;

    for (let index = 0; index < this.totalSlides; index++) {
      const slideType = this.slides[index].getAttribute(this.slideDatasetAttribute);

      if (slideType === "multi") {
        const leftSlide = this.slides[index].firstElementChild;
        const rightSlide = this.slides[index].lastElementChild;
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
        const fullSlide = this.slides[index].firstElementChild;
        const translateYFullSlide = parseInt(fullSlide.style.transform.replace(/[^-\d.]/g, ""));

        if (direction === "bottom") {
          fullSlide.style.transform = `translateY(${translateYFullSlide - 100}%)`;
        }

        if (direction === "top") {
          fullSlide.style.transform = `translateY(${translateYFullSlide + 100}%)`;
        }
      }
    }

    this.slides[this.currentSlide].style.zIndex = "";
    this.slides[this.currentSlide].setAttribute("aria-hidden", true);

    if (direction === "bottom") {
      this.slides[this.currentSlide].nextElementSibling.setAttribute("aria-hidden", false);
      this.navButtons[this.currentSlide].classList.remove(this.activeNavBtnClassname);
      this.currentSlide += 1;
    }

    if (direction === "top") {
      this.slides[this.currentSlide].previousElementSibling.setAttribute("aria-hidden", false);
      this.navButtons[this.currentSlide].classList.remove(this.activeNavBtnClassname);
      this.currentSlide -= 1;
    }

    this.navButtons[this.currentSlide].classList.add(this.activeNavBtnClassname);
    this.navButtons[this.currentSlide].focus();

    setTimeout(() => {
      this.slides[this.currentSlide].style.zIndex = "1";
      this.isWheelEventDelay = true;
    }, this.transitionDelayTime);
  }

  multipleTimeNavigate(direction, slideComparison, choosenSlide) {
    this.isWheelEventDelay = false;
    this.slides[this.currentSlide].style.zIndex = "";

    for (let index = 0; index < slideComparison; index++) {
      for (let innerIndex = 0; innerIndex < this.totalSlides; innerIndex++) {
        const slide = this.slides[innerIndex];
        const slideType = slide.getAttribute(this.slideDatasetAttribute);

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
          const fullSlide = this.slides[innerIndex].firstElementChild;
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

    this.slides[choosenSlide].setAttribute("aria-hidden", false);
    this.slides[this.currentSlide].setAttribute("aria-hidden", true);
    this.navButtons[this.currentSlide].classList.remove(this.activeNavBtnClassname);

    this.currentSlide = choosenSlide;

    this.navButtons[this.currentSlide].classList.add(this.activeNavBtnClassname);
    this.navButtons[this.currentSlide].focus();

    setTimeout(() => {
      this.slides[this.currentSlide].style.zIndex = "1";
      this.isWheelEventDelay = true;
    }, this.transitionDelayTime);
  }
}

new MultiScroll(992);
