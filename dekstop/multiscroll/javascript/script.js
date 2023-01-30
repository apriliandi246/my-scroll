// for "mobileSize" it is for CSS pixel

class MultiScroll {
  constructor(delayDuration, mobileSize) {
    this.currentSlide = 1;
    this.mobileSize = mobileSize;
    this.isWheelEventDelay = true;
    this.isKeyboardEventDelay = true;
    this.delayDuration = delayDuration;
    this.navDatasetAttribute = "data-slide-nav";
    this.slideDatasetAttribute = "data-slide-type";
    this.slides = document.getElementsByClassName("slide-wrapper");
    this.navButtons = document.getElementsByClassName("dots-navigate__dot");

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
    for (let index = 0; index < this.navButtons.length; index++) {
      this.navButtons[index].setAttribute(this.navDatasetAttribute, index + 1);
      this.navButtons[index].setAttribute("aria-label", `to slide ${index + 1}`);
    }
  }

  slidesFirstRender() {
    for (let index = 0; index < this.slides.length; index++) {
      const slide = this.slides[index];
      const totalElementChildSlide = slide.childElementCount;

      if (totalElementChildSlide === 2) {
        slide.setAttribute(this.slideDatasetAttribute, "multi");
        slide.firstElementChild.style.transform = `translateY(${index}00%)`;
        slide.lastElementChild.style.transform = `translateY(-${index}00%)`;
      }

      if (totalElementChildSlide === 1) {
        slide.setAttribute(this.slideDatasetAttribute, "full");
        slide.firstElementChild.style.transform = `translateY(${index}00%)`;
      }

      if (window.innerWidth > this.mobileSize) {
        this.slides[0].style.zIndex = "1";

        for (let index = 0; index < this.slides.length; index++) {
          if (index === 0) {
            this.slides[index].setAttribute("aria-hidden", false);
          }

          if (index !== 0) {
            this.slides[index].setAttribute("aria-hidden", true);
          }
        }
      }

      if (window.innerWidth < this.mobileSize) {
        for (let index = 0; index < this.slides.length; index++) {
          this.slides[index].removeAttribute("aria-hidden");
        }
      }
    }
  }

  setAriaHiddenWhileResizing() {
    window.addEventListener("resize", () => {
      if (window.innerWidth > this.mobileSize) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        this.slides[this.currentSlide - 1].style.zIndex = "1";

        for (let index = 0; index < this.slides.length; index++) {
          if (this.currentSlide - 1 === index) {
            this.slides[index].setAttribute("aria-hidden", false);
          }

          if (this.currentSlide - 1 !== index) {
            this.slides[index].setAttribute("aria-hidden", true);
          }
        }
      } else {
        this.slides[this.currentSlide - 1].style.zIndex = "auto";

        for (let index = 0; index < this.slides.length; index++) {
          this.slides[index].removeAttribute("aria-hidden");
        }
      }
    });
  }

  navigateNavButtons() {
    for (let index = 0; index < this.navButtons.length; index++) {
      this.navButtons[index].addEventListener("click", () => {
        if (window.innerWidth > this.mobileSize) {
          const slideNavNumber = this.navButtons[index].getAttribute(this.navDatasetAttribute);
          const slideSelected = parseInt(slideNavNumber);
          const slideComparison = Math.abs(this.currentSlide - slideSelected);

          if (this.currentSlide + 1 === slideSelected) {
            this.oneTimeNavigate("bottom");
          }

          if (this.currentSlide - 1 === slideSelected) {
            this.oneTimeNavigate("top");
          }

          if (this.currentSlide !== this.slides.length && slideSelected > this.currentSlide) {
            this.multipleTimeNavigate("bottom", slideComparison, slideSelected);
          }

          if (this.currentSlide !== 1 && slideSelected < this.currentSlide) {
            this.multipleTimeNavigate("top", slideComparison, slideSelected);
          }
        }
      });
    }
  }

  navigateMouseScroll() {
    window.addEventListener(
      "wheel",
      (event) => {
        if (window.innerWidth > this.mobileSize) {
          if (this.isWheelEventDelay === true) {
            const scrollValue = event.deltaY;
            this.isWheelEventDelay = false;

            if (this.currentSlide !== this.slides.length && scrollValue > 0) {
              this.oneTimeNavigate("bottom");
            }

            if (this.currentSlide !== 1 && scrollValue < 0) {
              this.oneTimeNavigate("top");
            }

            setTimeout(() => {
              this.isWheelEventDelay = true;
            }, this.delayDuration);
          }
        }
      },
      { passive: true }
    );
  }

  navigateKeyboard() {
    document.body.addEventListener("keydown", (event) => {
      if (window.innerWidth >= this.mobileSize) {
        if (this.isKeyboardEventDelay === true) {
          const keyboardKey = event.key.toLowerCase();
          this.isKeyboardEventDelay = false;

          if (this.currentSlide !== this.slides.length && keyboardKey === "end") {
            const slideComparison = Math.abs(this.currentSlide - this.slides.length);
            this.multipleTimeNavigate("bottom", slideComparison, this.slides.length);
          }

          if (this.currentSlide !== 1 && keyboardKey === "home") {
            const slideComparison = Math.abs(this.currentSlide - 1);
            this.multipleTimeNavigate("top", slideComparison, 1);
          }

          if (keyboardKey === "arrowdown" || keyboardKey === "pagedown") {
            if (this.currentSlide !== this.slides.length) {
              this.oneTimeNavigate("bottom");
            }
          }

          if (keyboardKey === "arrowup" || keyboardKey === "pageup") {
            if (this.currentSlide !== 1) {
              this.oneTimeNavigate("top");
            }
          }

          setTimeout(() => {
            this.isKeyboardEventDelay = true;
          }, this.delayDuration);
        }
      }
    });
  }

  oneTimeNavigate(direction) {
    for (let index = 0; index < this.slides.length; index++) {
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

    this.slides[this.currentSlide - 1].style.zIndex = "auto";
    this.slides[this.currentSlide - 1].setAttribute("aria-hidden", true);

    if (direction === "bottom") {
      this.slides[this.currentSlide - 1].nextElementSibling.setAttribute("aria-hidden", false);
      this.navButtons[this.currentSlide - 1].classList.remove("dots-navigate__dot--active");
      this.currentSlide += 1;
    }

    if (direction === "top") {
      this.slides[this.currentSlide - 1].previousElementSibling.setAttribute("aria-hidden", false);
      this.navButtons[this.currentSlide - 1].classList.remove("dots-navigate__dot--active");
      this.currentSlide -= 1;
    }

    this.navButtons[this.currentSlide - 1].classList.add("dots-navigate__dot--active");
    this.navButtons[this.currentSlide - 1].focus();
    this.slides[this.currentSlide - 1].style.zIndex = "1";
  }

  multipleTimeNavigate(direction, slideComparison, recentSlide) {
    this.slides[this.currentSlide - 1].style.zIndex = "auto";

    for (let index = 0; index < slideComparison; index++) {
      for (let innerIndex = 0; innerIndex < this.slides.length; innerIndex++) {
        const slideType = this.slides[innerIndex].getAttribute(this.slideDatasetAttribute);

        if (slideType === "multi") {
          const leftSlide = this.slides[innerIndex].firstElementChild;
          const rightSlide = this.slides[innerIndex].lastElementChild;
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
          const fullSlide = this.slides[innerIndex].firstElementChild;
          const translateYFullSlide = parseInt(fullSlide.style.transform.replace(/[^-\d.]/g, ""));

          if (direction === "bottom") {
            fullSlide.style.transform = `translateY(${translateYFullSlide - 100}%)`;
          }

          if (direction === "top") {
            fullSlide.style.transform = `translateY(${translateYFullSlide + 100}%)`;
          }
        }
      }
    }

    this.slides[recentSlide - 1].setAttribute("aria-hidden", false);
    this.slides[this.currentSlide - 1].setAttribute("aria-hidden", true);
    this.navButtons[this.currentSlide - 1].classList.remove("dots-navigate__dot--active");

    this.currentSlide = recentSlide;

    this.navButtons[this.currentSlide - 1].classList.add("dots-navigate__dot--active");
    this.navButtons[this.currentSlide - 1].focus();
    this.slides[this.currentSlide - 1].style.zIndex = "1";
  }
}

new MultiScroll(600, 992);
