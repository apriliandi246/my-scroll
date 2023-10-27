class MultiScroll {
  constructor(delayDuration, mobileSize) {
    this.currentSlide = 1;
    this.mobileSize = mobileSize;
    this.isWheelEventDelay = true;
    this.isKeyboardEventDelay = true;
    this.delayDuration = delayDuration;
    this.slides = document.getElementsByClassName("slide-wrapper");
    this.slidesContainer = document.getElementById("slides-container");

    this.triggerFunctionalities();
  }

  triggerFunctionalities() {
    this.slidesFirstRender();
    this.mobileSwipeNavigate();
  }

  slidesFirstRender() {
    this.slidesContainer.style.transform = "translateY(0%)";

    for (let index = 0; index < this.slides.length; index++) {
      this.slides[index].firstElementChild.style.transform = `translateY(${index}00%)`;
    }
  }

  mobileSwipeNavigate() {
    let prevScreenY = 0;
    let swipeResult = "none";
    let isTopSwipeLimit = false;
    let isBottomSwipeLimit = false;

    document.addEventListener(
      "touchmove",
      (event) => {
        const currentScreenY = event.changedTouches[0].screenY;
        let slideContainerPosition = parseInt(this.slidesContainer.style.transform.replace(/[^-\d.]/g, ""));

        if (prevScreenY === 0) {
          prevScreenY = currentScreenY;
        }

        if (currentScreenY !== 0) {
          // swipe to top
          if (prevScreenY > currentScreenY) {
            if (this.currentSlide === this.slides.length) {
              if (slideContainerPosition <= -915) return;

              isTopSwipeLimit = true;
              slideContainerPosition -= 1;
              this.slidesContainer.style.transform = `translateY(${slideContainerPosition}%)`;
            } else {
              swipeResult = "top";
              slideContainerPosition -= 1;
              this.slidesContainer.style.transform = `translateY(${slideContainerPosition}%)`;
            }
          }

          // swipe to bottom
          if (prevScreenY < currentScreenY) {
            if (this.currentSlide === 1) {
              if (slideContainerPosition >= 15) return;

              isBottomSwipeLimit = true;
              slideContainerPosition += 1;
              this.slidesContainer.style.transform = `translateY(${slideContainerPosition}%)`;
            } else {
              swipeResult = "bottom";
              slideContainerPosition += 1;
              this.slidesContainer.style.transform = `translateY(${slideContainerPosition}%)`;
            }
          }

          prevScreenY = currentScreenY;
        }
      },
      { passive: true }
    );

    document.addEventListener("touchend", () => {
      prevScreenY = 0;

      if (swipeResult === "top") {
        this.navigateSlide("top");
      }

      if (swipeResult === "bottom") {
        this.navigateSlide("bottom");
      }

      if (isBottomSwipeLimit === true) {
        this.slidesContainer.classList.add("slide-transition-limit");
        this.slidesContainer.style.transform = `translateY(0%)`;
        isBottomSwipeLimit = false;

        setTimeout(() => {
          this.slidesContainer.classList.remove("slide-transition-limit");
        }, 300);
      }

      if (isTopSwipeLimit === true) {
        this.slidesContainer.classList.add("slide-transition-limit");
        this.slidesContainer.style.transform = `translateY(-900%)`;
        isTopSwipeLimit = false;

        setTimeout(() => {
          this.slidesContainer.classList.remove("slide-transition-limit");
        }, 300);
      }

      swipeResult = "none";
    });
  }

  navigateSlide(direction) {
    this.slidesContainer.classList.add("slide-transition-navigate");

    if (direction === "top" && this.currentSlide !== this.slides.length) {
      this.currentSlide += 1;
      this.slidesContainer.style.transform = `translateY(-${this.currentSlide - 1}00%)`;
    }

    if (direction === "bottom" && this.currentSlide !== 1) {
      this.currentSlide -= 1;
      this.slidesContainer.style.transform = `translateY(${parseInt(`-${this.currentSlide}00`) + 100}%)`;
    }

    setTimeout(() => {
      this.slidesContainer.classList.remove("slide-transition-navigate");
    }, 300);
  }
}

new MultiScroll(600, 992);
