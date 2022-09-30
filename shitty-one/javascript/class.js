class MultiScroll {
  constructor() {
    this.prevSlide = 1;
    this.currentSlide = 1;
    this.canWheel = true;
    this.canKeydown = true;
    this.MOBILE_SIZE = 992;

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
      const leftTranslateY = parseInt(leftSlide.style.transform.replace(/[^-\d.]/g, ""));
      const rightTranslateY = parseInt(rightSlide.style.transform.replace(/[^-\d.]/g, ""));
      const slideType = this.slides[index].dataset.slideType.toLowerCase();

      if (direction === "bottom") {
        if (slideType === "multi") {
          leftSlide.style.transform = `translateY(${leftTranslateY - 100}%)`;
          rightSlide.style.transform = `translateY(${rightTranslateY + 100}%)`;
        }

        if (slideType === "full") {
          leftSlide.style.transform = `translateY(${leftTranslateY - 100}%)`;
        }
      }

      if (direction === "top") {
        if (slideType === "multi") {
          leftSlide.style.transform = `translateY(${leftTranslateY + 100}%)`;
          rightSlide.style.transform = `translateY(${rightTranslateY - 100}%)`;
        }

        if (slideType === "full") {
          leftSlide.style.transform = `translateY(${leftTranslateY + 100}%)`;
        }
      }
    }

    this.slides[this.currentSlide - 1].removeAttribute("style");

    if (direction === "bottom") {
      this.slides[this.currentSlide - 1].setAttribute("aria-hidden", true);
      this.slides[this.currentSlide - 1].nextElementSibling.removeAttribute("aria-hidden");
      this.navButtons[this.prevSlide - 1].classList.remove("dots-navigate__dot--active");

      this.currentSlide += 1;
      this.prevSlide = this.currentSlide;

      this.navButtons[this.currentSlide - 1].classList.add("dots-navigate__dot--active");
      this.navButtons[this.currentSlide - 1].focus();
    }

    if (direction === "top") {
      this.slides[this.currentSlide - 1].setAttribute("aria-hidden", true);
      this.slides[this.currentSlide - 1].previousElementSibling.removeAttribute("aria-hidden");
      this.navButtons[this.prevSlide - 1].classList.remove("dots-navigate__dot--active");

      this.currentSlide -= 1;
      this.prevSlide = this.currentSlide;

      this.navButtons[this.currentSlide - 1].classList.add("dots-navigate__dot--active");
      this.navButtons[this.currentSlide - 1].focus();
    }

    this.slides[this.currentSlide - 1].style.zIndex = "1";
  }

  multipleTimeSliding(direction, slideComparison, recentSlide) {
    this.slides[this.currentSlide - 1].removeAttribute("style");

    if (direction === "bottom") {
      for (let index = 0; index < slideComparison; index++) {
        for (let innerIndex = 0; innerIndex < this.totalSlide; innerIndex++) {
          const leftSlide = this.slides[innerIndex].firstElementChild;
          const rightSlide = this.slides[innerIndex].lastElementChild;
          const leftTranslateY = parseInt(leftSlide.style.transform.replace(/[^-\d.]/g, ""));
          const rightTranslateY = parseInt(rightSlide.style.transform.replace(/[^-\d.]/g, ""));
          const slideType = this.slides[innerIndex].dataset.slideType.toLowerCase();

          if (slideType === "multi") {
            leftSlide.style.transform = `translateY(${leftTranslateY - 100}%)`;
            rightSlide.style.transform = `translateY(${rightTranslateY + 100}%)`;
          }

          if (slideType === "full") {
            leftSlide.style.transform = `translateY(${leftTranslateY - 100}%)`;
          }
        }
      }

      this.slides[this.currentSlide - 1].setAttribute("aria-hidden", true);
      this.slides[this.currentSlide - 1].removeAttribute("aria-hidden");
      this.navButtons[this.prevSlide - 1].classList.remove("dots-navigate__dot--active");

      this.currentSlide = recentSlide;
      this.prevSlide = recentSlide;

      this.navButtons[this.currentSlide - 1].classList.add("dots-navigate__dot--active");
      this.navButtons[this.currentSlide - 1].focus();
    }

    if (direction === "top") {
      for (let index = 0; index < slideComparison; index++) {
        for (let innerIndex = 0; innerIndex < this.totalSlide; innerIndex++) {
          const leftSlide = this.slides[innerIndex].firstElementChild;
          const rightSlide = this.slides[innerIndex].lastElementChild;
          const leftTranslateY = parseInt(leftSlide.style.transform.replace(/[^-\d.]/g, ""));
          const rightTranslateY = parseInt(rightSlide.style.transform.replace(/[^-\d.]/g, ""));
          const slideType = this.slides[innerIndex].dataset.slideType.toLowerCase();

          if (slideType === "multi") {
            leftSlide.style.transform = `translateY(${leftTranslateY + 100}%)`;
            rightSlide.style.transform = `translateY(${rightTranslateY - 100}%)`;
          }

          if (slideType === "full") {
            leftSlide.style.transform = `translateY(${leftTranslateY + 100}%)`;
          }
        }
      }

      this.slides[this.currentSlide - 1].setAttribute("aria-hidden", true);
      this.slides[recentSlide - 1].removeAttribute("aria-hidden");
      this.navButtons[this.prevSlide - 1].classList.remove("dots-navigate__dot--active");

      this.currentSlide = recentSlide;
      this.prevSlide = recentSlide;

      this.navButtons[this.currentSlide - 1].classList.add("dots-navigate__dot--active");
      this.navButtons[this.currentSlide - 1].focus();
    }

    this.slides[this.currentSlide - 1].style.zIndex = "1";
  }

  removeMobileAriaHidden() {
    document.addEventListener("DOMContentLoaded", () => {
      if (window.innerWidth < this.MOBILE_SIZE) {
        for (let index = 0; index < this.totalSlide; index++) {
          this.slides[index].removeAttribute("aria-hidden");
        }
      }
    });
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
          const currentSlideSelected = parseInt(event.target.dataset.slideNav);
          const slideComparison = Math.abs(this.prevSlide - currentSlideSelected);

          if (this.currentSlide !== this.totalSlide && currentSlideSelected > this.prevSlide) {
            this.multipleTimeSliding("bottom", slideComparison, currentSlideSelected);
          }

          if (this.currentSlide !== 1 && currentSlideSelected < this.prevSlide) {
            this.multipleTimeSliding("top", slideComparison, currentSlideSelected);
          }
        }
      });
    }
  }

  mouseWheelEvent() {
    document.body.addEventListener("wheel", (event) => {
      if (window.innerWidth > this.MOBILE_SIZE) {
        if (this.canWheel === true) {
          const scrollValue = event.deltaY;

          this.canWheel = false;

          if (this.currentSlide !== this.totalSlide && scrollValue > 0) {
            this.oneTimeSliding("bottom");
          }

          if (this.currentSlide !== 1 && scrollValue < 0) {
            this.oneTimeSliding("top");
          }

          setTimeout(() => {
            this.canWheel = true;
          }, 700)
        }
      }
    }, { passive: true });
  }

  keyboardEvents() {
    document.body.addEventListener("keydown", (event) => {
      if (window.innerWidth >= this.MOBILE_SIZE) {
        if (this.canKeydown === true) {
          const keyboardKey = event.key.toLowerCase();

          this.canKeydown = false;

          if (this.currentSlide !== this.totalSlide && keyboardKey === "end") {
            const slideComparison = Math.abs(this.prevSlide - this.totalSlide);
            this.multipleTimeSliding("bottom", slideComparison, this.totalSlide);
          }

          if (this.currentSlide !== 1 && keyboardKey === "home") {
            const slideComparison = Math.abs(this.prevSlide - 1);
            this.multipleTimeSliding("top", slideComparison, 1);
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
            this.canKeydown = true;
          }, 700);
        }
      }
    });
  }
}

new MultiScroll();