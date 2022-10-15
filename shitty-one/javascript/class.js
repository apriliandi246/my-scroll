class MultiScroll {
  constructor() {
    this.currentSlide = 1;
    this.MOBILE_SIZE = 992;
    this.isWheelEventDelay = true;
    this.isKeyboardEventDelay = true;

    this.slides = document.getElementsByClassName("slide-wrapper");
    this.navButtons = document.getElementsByClassName("dots-navigate__dot");
    this.totalSlide = this.slides.length;

    this.triggerEventListeners();
  }

  triggerEventListeners() {
    this.keyboardEvents();
    this.mouseWheelEvent();
    this.navigatingButtons();
    this.removeMobileAriaHidden();
    this.setAriaHiddenWhileResizing();
  }

  oneTimeSliding(direction) {
    for (let index = 0; index < this.totalSlide; index++) {
      const leftSlide = this.slides[index].firstElementChild;
      const rightSlide = this.slides[index].lastElementChild;
      const translateYLeftSlide = parseInt(leftSlide.style.transform.replace(/[^-\d.]/g, ""));
      const translateYRightSlide = parseInt(rightSlide.style.transform.replace(/[^-\d.]/g, ""));
      const slideType = this.slides[index].dataset.slideType.toLowerCase();

      if (direction === "bottom") {
        if (slideType === "multi") {
          leftSlide.style.transform = `translateY(${translateYLeftSlide - 100}%)`;
          rightSlide.style.transform = `translateY(${translateYRightSlide + 100}%)`;
        }

        if (slideType === "full") {
          leftSlide.style.transform = `translateY(${translateYLeftSlide - 100}%)`;
        }
      }

      if (direction === "top") {
        if (slideType === "multi") {
          leftSlide.style.transform = `translateY(${translateYLeftSlide + 100}%)`;
          rightSlide.style.transform = `translateY(${translateYRightSlide - 100}%)`;
        }

        if (slideType === "full") {
          leftSlide.style.transform = `translateY(${translateYLeftSlide + 100}%)`;
        }
      }
    }

    this.slides[this.currentSlide - 1].removeAttribute("style");
    this.slides[this.currentSlide - 1].setAttribute("aria-hidden", true);

    if (direction === "bottom") {
      this.slides[this.currentSlide - 1].nextElementSibling.removeAttribute("aria-hidden");
      this.navButtons[this.currentSlide - 1].classList.remove("dots-navigate__dot--active");
      this.currentSlide += 1;
    }

    if (direction === "top") {
      this.slides[this.currentSlide - 1].previousElementSibling.removeAttribute("aria-hidden");
      this.navButtons[this.currentSlide - 1].classList.remove("dots-navigate__dot--active");
      this.currentSlide -= 1;
    }

    this.navButtons[this.currentSlide - 1].classList.add("dots-navigate__dot--active");
    this.navButtons[this.currentSlide - 1].focus();
    this.slides[this.currentSlide - 1].style.zIndex = "1";
  }

  multipleTimeSliding(direction, slideComparison, recentSlide) {
    this.slides[this.currentSlide - 1].removeAttribute("style");

    for (let index = 0; index < slideComparison; index++) {
      for (let innerIndex = 0; innerIndex < this.totalSlide; innerIndex++) {
        const leftSlide = this.slides[innerIndex].firstElementChild;
        const rightSlide = this.slides[innerIndex].lastElementChild;
        const translateYLeftSlide = parseInt(leftSlide.style.transform.replace(/[^-\d.]/g, ""));
        const translateYRightSlide = parseInt(rightSlide.style.transform.replace(/[^-\d.]/g, ""));
        const slideType = this.slides[innerIndex].dataset.slideType.toLowerCase();

        if (direction === "bottom") {
          if (slideType === "multi") {
            leftSlide.style.transform = `translateY(${translateYLeftSlide - 100}%)`;
            rightSlide.style.transform = `translateY(${translateYRightSlide + 100}%)`;
          }

          if (slideType === "full") {
            leftSlide.style.transform = `translateY(${translateYLeftSlide - 100}%)`;
          }
        }

        if (direction === "top") {
          if (slideType === "multi") {
            leftSlide.style.transform = `translateY(${translateYLeftSlide + 100}%)`;
            rightSlide.style.transform = `translateY(${translateYRightSlide - 100}%)`;
          }

          if (slideType === "full") {
            leftSlide.style.transform = `translateY(${translateYLeftSlide + 100}%)`;
          }
        }
      }
    }

    this.slides[this.currentSlide - 1].setAttribute("aria-hidden", true);
    this.slides[recentSlide - 1].removeAttribute("aria-hidden");
    this.navButtons[this.currentSlide - 1].classList.remove("dots-navigate__dot--active");

    this.currentSlide = recentSlide;

    this.navButtons[this.currentSlide - 1].classList.add("dots-navigate__dot--active");
    this.navButtons[this.currentSlide - 1].focus();
    this.slides[this.currentSlide - 1].style.zIndex = "1";
  }

  removeMobileAriaHidden() {
    if (window.innerWidth < this.MOBILE_SIZE) {
      for (let index = 0; index < this.totalSlide; index++) {
        this.slides[index].removeAttribute("aria-hidden");
      }
    }
  }

  setAriaHiddenWhileResizing() {
    window.addEventListener("resize", (event) => {
      if (event.target.innerWidth > this.MOBILE_SIZE) {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;

        this.slides[this.currentSlide - 1].style.setProperty("z-index", "1");

        for (let index = 0; index < this.totalSlide; index++) {
          if (index !== this.currentSlide - 1) {
            this.slides[index].setAttribute("aria-hidden", true);
          }
        }
      } else {
        this.slides[this.currentSlide - 1].style.removeProperty("z-index");

        for (let index = 0; index < this.totalSlide; index++) {
          this.slides[index].removeAttribute("aria-hidden");
        }
      }
    });
  }

  navigatingButtons() {
    for (let index = 0; index < this.navButtons.length; index++) {
      this.navButtons[index].addEventListener("click", (event) => {
        if (window.innerWidth > this.MOBILE_SIZE) {
          const slideSelected = parseInt(event.target.dataset.slideNav);
          const slideComparison = Math.abs(this.currentSlide - slideSelected);

          if (this.currentSlide + 1 === slideSelected || this.currentSlide - 1 === slideSelected) {
            if (slideSelected > this.currentSlide) {
              this.oneTimeSliding("bottom");
            }

            if (slideSelected < this.currentSlide) {
              this.oneTimeSliding("top");
            }
          }

          if (this.currentSlide !== this.totalSlide && slideSelected > this.currentSlide) {
            this.multipleTimeSliding("bottom", slideComparison, slideSelected);
          }

          if (this.currentSlide !== 1 && slideSelected < this.currentSlide) {
            this.multipleTimeSliding("top", slideComparison, slideSelected);
          }
        }
      });
    }
  }

  mouseWheelEvent() {
    document.body.addEventListener(
      "wheel",
      (event) => {
        if (window.innerWidth > this.MOBILE_SIZE) {
          if (this.isWheelEventDelay === true) {
            const scrollValue = event.deltaY;

            this.isWheelEventDelay = false;

            if (this.currentSlide !== this.totalSlide && scrollValue > 0) {
              this.oneTimeSliding("bottom");
            }

            if (this.currentSlide !== 1 && scrollValue < 0) {
              this.oneTimeSliding("top");
            }

            setTimeout(() => {
              this.isWheelEventDelay = true;
            }, 700);
          }
        }
      },
      { passive: true }
    );
  }

  keyboardEvents() {
    document.body.addEventListener("keydown", (event) => {
      if (window.innerWidth >= this.MOBILE_SIZE) {
        if (this.isKeyboardEventDelay === true) {
          const keyboardKey = event.key.toLowerCase();

          this.isKeyboardEventDelay = false;

          if (this.currentSlide !== this.totalSlide && keyboardKey === "end") {
            this.multipleTimeSliding(
              "bottom",
              Math.abs(this.currentSlide - this.totalSlide),
              this.totalSlide
            );
          }

          if (this.currentSlide !== 1 && keyboardKey === "home") {
            this.multipleTimeSliding("top", Math.abs(this.currentSlide - 1), 1);
          }

          if (keyboardKey === "arrowdown" || keyboardKey === "pagedown") {
            if (this.currentSlide !== this.totalSlide) {
              this.oneTimeSliding("bottom");
            }
          }

          if (keyboardKey === "arrowup" || keyboardKey === "pageup") {
            if (this.currentSlide !== 1) {
              this.oneTimeSliding("top");
            }
          }

          setTimeout(() => {
            this.isKeyboardEventDelay = true;
          }, 700);
        }
      }
    });
  }
}

new MultiScroll();
