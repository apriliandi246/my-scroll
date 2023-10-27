class MultiScroll {
  constructor(delayDuration, mobileSize) {
    this.currentSlide = 0;
    this.mobileSize = mobileSize;
    this.isWheelEventDelay = true;
    this.isKeyboardEventDelay = true;
    this.delayDuration = delayDuration;
    this.slides = document.getElementsByClassName("slide-wrapper");
    this.slidesContainer = document.getElementById("slides-container");

    this.currentPositionValue = 0;
    this.oneTimeSwipeDirectionResult = "none";
    this.constantlySwipeDirectionResult = "none";
    this.heightLayoutViewport = window.innerHeight;

    this.triggerFunctionalities();
  }

  triggerFunctionalities() {
    this.slidesFirstRender();
    // this.mobileSwipeNavigate();

    this.oneTimeSwipe();
    this.constantlySwipe();
  }

  slidesFirstRender() {
    let positionValue = 0;
    this.slidesContainer.style.transform = `translateY(0)`;

    for (let index = 0; index < this.slides.length; index++) {
      if (index === 0) {
        this.slides[index].firstElementChild.style.transform = `translateY(0)`;
      } else {
        positionValue += this.heightLayoutViewport;
        this.slides[index].firstElementChild.style.transform = `translateY(${positionValue}px)`;
      }
    }
  }

  oneTimeSwipe() {
    let touchendY = 0;
    let touchstartY = 0;

    document.addEventListener(
      "touchstart",
      (event) => {
        touchstartY = event.changedTouches[0].screenY;
      },
      { passive: true }
    );

    document.addEventListener("touchend", (event) => {
      touchendY = event.changedTouches[0].screenY;

      if (touchendY < touchstartY) {
        this.oneTimeSwipeDirectionResult = "top";
      }

      if (touchendY > touchstartY) {
        this.oneTimeSwipeDirectionResult = "bottom";
      }

      console.log(`onetime-${this.oneTimeSwipeDirectionResult}`);
    });
  }

  constantlySwipe() {
    let prevScreenY = 0;

    document.addEventListener(
      "touchmove",
      (event) => {
        const currentScreenY = event.changedTouches[0].screenY;

        if (prevScreenY === 0) {
          prevScreenY = event.changedTouches[0].screenY;
        }

        if (prevScreenY > currentScreenY) {
          console.log("top");
          this.constantlySwipeDirectionResult = "top";
        }

        if (prevScreenY < currentScreenY) {
          console.log("bottom");
          this.constantlySwipeDirectionResult = "bottom";
        }

        prevScreenY = currentScreenY;
      },
      { passive: true }
    );

    document.addEventListener("touchend", (event) => {
      console.log(`constantly-${this.constantlySwipeDirectionResult}`);
    });
  }

  mobileSwipeNavigate() {
    let prevScreenY = 0;
    let swipeDirection = "none";

    let swipingTopLimitValue = 0;
    let swipingBottomLimitValue = 0;

    document.addEventListener(
      "touchmove",
      (event) => {
        const currentScreenY = event.changedTouches[0].screenY;

        if (prevScreenY === 0) {
          prevScreenY = currentScreenY;
        }

        if (currentScreenY !== 0) {
          // swipe to top
          if (prevScreenY > currentScreenY) {
            swipeDirection = "top";

            if (this.currentSlide === this.slides.length - 1 && swipingBottomLimitValue <= 60) {
              swipingBottomLimitValue += 4;
              this.slidesContainer.style.transform = `translateY(-${this.currentPositionValue + swipingBottomLimitValue}px)`;
            }
          }

          // swipe to bottom
          if (prevScreenY < currentScreenY) {
            swipeDirection = "bottom";

            if (this.currentSlide === 0 && swipingTopLimitValue <= 60) {
              swipingTopLimitValue += 4;
              this.slidesContainer.style.transform = `translateY(${swipingTopLimitValue}px)`;
            }
          }

          prevScreenY = currentScreenY;
        }
      },
      { passive: true }
    );

    document.addEventListener("touchend", () => {
      prevScreenY = 0;

      if (swipeDirection === "top") {
        this.navigateSlide("top");
      }

      if (swipeDirection === "bottom") {
        this.navigateSlide("bottom");
      }

      if (swipingTopLimitValue !== 0) {
        swipingTopLimitValue = 0;
        this.slidesContainer.classList.add("slide-transition-limit");
        this.slidesContainer.style.transform = `translateY(${this.currentPositionValue}px)`;

        setTimeout(() => {
          this.slidesContainer.classList.remove("slide-transition-limit");
        }, 200);
      }

      if (swipingBottomLimitValue !== 0) {
        swipingBottomLimitValue = 0;
        this.slidesContainer.classList.add("slide-transition-limit");
        this.slidesContainer.style.transform = `translateY(-${this.currentPositionValue}px)`;

        setTimeout(() => {
          this.slidesContainer.classList.remove("slide-transition-limit");
        }, 200);
      }

      swipeDirection = "none";
    });
  }

  navigateSlide(direction) {
    if (direction === "top") {
      if (this.currentSlide !== this.slides.length - 1) {
        let totalPositionValue = this.currentPositionValue + this.heightLayoutViewport;

        this.slidesContainer.classList.add("slide-transition-navigate");
        this.currentPositionValue = totalPositionValue;
        this.slidesContainer.style.transform = `translateY(-${totalPositionValue}px)`;
        this.currentSlide += 1;

        setTimeout(() => {
          this.slidesContainer.classList.remove("slide-transition-navigate");
        }, 300);
      }
    }

    if (direction === "bottom") {
      if (this.currentSlide !== 0) {
        let totalPositionValue = this.currentPositionValue - this.heightLayoutViewport;

        this.slidesContainer.classList.add("slide-transition-navigate");
        this.currentPositionValue = totalPositionValue;
        this.slidesContainer.style.transform = `translateY(-${totalPositionValue}px)`;
        this.currentSlide -= 1;

        setTimeout(() => {
          this.slidesContainer.classList.remove("slide-transition-navigate");
        }, 300);
      }
    }
  }
}

new MultiScroll(600, 992);
