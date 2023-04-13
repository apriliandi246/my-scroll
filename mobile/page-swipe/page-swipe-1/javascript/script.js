// z-index issue

class MultiScroll {
  constructor(delayDuration, mobileSize) {
    this.currentSlide = 1;
    this.mobileSize = mobileSize;
    this.isWheelEventDelay = true;
    this.isKeyboardEventDelay = true;
    this.delayDuration = delayDuration;
    this.slides = document.getElementsByClassName("slide-wrapper");

    this.triggerFunctionalities();
  }

  triggerFunctionalities() {
    this.slidesFirstRender();
    this.mobileSwipeNavigate();
    this.mouseScrollNavigate();
  }

  slidesFirstRender() {
    this.slides[0].style.zIndex = "1";

    for (let index = 0; index < this.slides.length; index++) {
      this.slides[index].firstElementChild.style.transform = `translateY(${index}00%)`;
    }
  }

  mobileSwipeNavigate() {
    let startX;
    let startY;

    document.addEventListener(
      "touchstart",
      (event) => {
        startX = event.touches[0].clientX;
        startY = event.touches[0].clientY;
      },
      false
    );

    document.addEventListener(
      "touchmove",
      (event) => {
        if (!startX || !startY) return;

        const moveX = event.touches[0].clientX;
        const moveY = event.touches[0].clientY;

        const resultX = startX - moveX;
        const resultY = startY - moveY;

        if (Math.abs(resultY) > Math.abs(resultX)) {
          if (resultY > 0 && this.currentSlide !== this.slides.length) {
            this.oneTimeNavigate("bottom");
          }

          if (resultY < 0 && this.currentSlide !== 1) {
            this.oneTimeNavigate("top");
          }
        }

        startX = null;
        startY = null;
      },
      false
    );
  }

  mouseScrollNavigate() {
    window.addEventListener(
      "wheel",
      (event) => {
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
      },
      { passive: true }
    );
  }

  oneTimeNavigate(direction) {
    for (let index = 0; index < this.slides.length; index++) {
      const fullSlide = this.slides[index].firstElementChild;
      const translateYFullSlide = parseInt(fullSlide.style.transform.replace(/[^-\d.]/g, ""));

      if (direction === "bottom") {
        fullSlide.style.transform = `translateY(${translateYFullSlide - 100}%)`;
      }

      if (direction === "top") {
        fullSlide.style.transform = `translateY(${translateYFullSlide + 100}%)`;
      }
    }

    this.slides[this.currentSlide - 1].style.zIndex = "";

    if (direction === "bottom") {
      this.currentSlide += 1;
    }

    if (direction === "top") {
      this.currentSlide -= 1;
    }

    this.slides[this.currentSlide - 1].style.zIndex = "1";
  }
}

new MultiScroll(600, 992);
