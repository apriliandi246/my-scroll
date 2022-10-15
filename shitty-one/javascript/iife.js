(function () {
  let currentSlide = 1;
  let isWheelEventDelay = true;
  let isKeyboardEventDelay = true;

  const MOBILE_SIZE = 992;
  const body = document.body;
  const slides = document.getElementsByClassName("slide-wrapper");
  const navButtons = document.getElementsByClassName("dots-navigate__dot");
  const totalSlide = slides.length;

  // Hanlde one step sliding
  function oneStepSliding(direction) {
    for (let index = 0; index < totalSlide; index++) {
      const leftSlide = slides[index].firstElementChild;
      const rightSlide = slides[index].lastElementChild;
      const translateYLeftSlide = parseInt(leftSlide.style.transform.replace(/[^-\d.]/g, ""));
      const translateYRightSlide = parseInt(rightSlide.style.transform.replace(/[^-\d.]/g, ""));
      const slideType = slides[index].dataset.slideType.toLowerCase();

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

    slides[currentSlide - 1].removeAttribute("style");
    slides[currentSlide - 1].setAttribute("aria-hidden", true);
    navButtons[currentSlide - 1].classList.remove("dots-navigate__dot--active");

    if (direction === "bottom") {
      slides[currentSlide - 1].nextElementSibling.removeAttribute("aria-hidden");
      currentSlide += 1;
    }

    if (direction === "top") {
      slides[currentSlide - 1].previousElementSibling.removeAttribute("aria-hidden");
      currentSlide -= 1;
    }

    navButtons[currentSlide - 1].classList.add("dots-navigate__dot--active");
    navButtons[currentSlide - 1].focus();
    slides[currentSlide - 1].style.zIndex = "1";
  }

  // Handle more than one step sliding
  function multipleSliding(direction, slideComparison, recentSlide) {
    slides[currentSlide - 1].removeAttribute("style");

    for (let index = 0; index < slideComparison; index++) {
      for (let innerIndex = 0; innerIndex < totalSlide; innerIndex++) {
        const leftSlide = slides[innerIndex].firstElementChild;
        const rightSlide = slides[innerIndex].lastElementChild;
        const translateYLeftSlide = parseInt(leftSlide.style.transform.replace(/[^-\d.]/g, ""));
        const translateYRightSlide = parseInt(rightSlide.style.transform.replace(/[^-\d.]/g, ""));
        const slideType = slides[innerIndex].dataset.slideType.toLowerCase();

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

    slides[currentSlide - 1].setAttribute("aria-hidden", true);
    slides[recentSlide - 1].removeAttribute("aria-hidden");
    navButtons[currentSlide - 1].classList.remove("dots-navigate__dot--active");

    currentSlide = recentSlide;

    navButtons[currentSlide - 1].classList.add("dots-navigate__dot--active");
    navButtons[currentSlide - 1].focus();
    slides[currentSlide - 1].style.zIndex = "1";
  }

  // Generate some important things when HTML got parsed
  document.addEventListener("DOMContentLoaded", () => {
    // Handle aria-hidden when comes to mobile view
    if (window.innerWidth < MOBILE_SIZE) {
      for (let index = 0; index < slides.length; index++) {
        slides[index].removeAttribute("aria-hidden");
      }
    }

    // Buttons nav
    for (let index = 0; index < navButtons.length; index++) {
      navButtons[index].addEventListener("click", (event) => {
        if (window.innerWidth > MOBILE_SIZE) {
          const currentSlideSelected = parseInt(event.target.dataset.slideNav);
          const slideComparison = Math.abs(currentSlide - currentSlideSelected);

          // Slide to bottom
          if (currentSlide !== totalSlide && currentSlideSelected > currentSlide) {
            multipleSliding("bottom", slideComparison, currentSlideSelected);
          }

          // Slide to top
          if (currentSlide !== 1 && currentSlideSelected < currentSlide) {
            multipleSliding("top", slideComparison, currentSlideSelected);
          }
        }
      });
    }
  });

  // Mouse wheel
  body.addEventListener(
    "wheel",
    (event) => {
      if (window.innerWidth > MOBILE_SIZE) {
        if (isWheelEventDelay === true) {
          const scrollValue = event.deltaY;

          isWheelEventDelay = false;

          // Scroll to bottom
          if (currentSlide !== totalSlide && scrollValue > 0) {
            oneStepSliding("bottom");
          }

          // Scroll to top
          if (currentSlide !== 1 && scrollValue < 0) {
            oneStepSliding("top");
          }

          setTimeout(() => {
            isWheelEventDelay = true;
          }, 700);
        }
      }
    },
    { passive: true }
  );

  // Keyboard interactions
  body.addEventListener("keydown", (event) => {
    if (window.innerWidth >= MOBILE_SIZE) {
      if (isKeyboardEventDelay === true) {
        const key = event.key.toLowerCase();

        isKeyboardEventDelay = false;

        // End
        if (currentSlide !== totalSlide && key === "end") {
          const slideComparison = Math.abs(currentSlide - totalSlide);
          multipleSliding("bottom", slideComparison, totalSlide);
        }

        // Home
        if (currentSlide !== 1 && key === "home") {
          const slideComparison = Math.abs(currentSlide - 1);
          multipleSliding("top", slideComparison, 1);
        }

        // ArrowDown and PageDown
        if (key === "arrowdown" || key === "pagedown") {
          if (currentSlide !== totalSlide) {
            oneStepSliding("bottom");
          }
        }

        // ArrowUp and PageUp
        if (key === "arrowup" || key === "pageup") {
          if (currentSlide !== 1) {
            oneStepSliding("top");
          }
        }

        setTimeout(() => {
          isKeyboardEventDelay = true;
        }, 700);
      }
    }
  });

  // Handle aria-hidden when resizing the viewport
  window.addEventListener("resize", (event) => {
    if (event.target.innerWidth > MOBILE_SIZE) {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;

      slides[currentSlide - 1].style.setProperty("z-index", "1");

      for (let index = 0; index < slides.length; index++) {
        if (index !== currentSlide - 1) {
          slides[index].setAttribute("aria-hidden", true);
        }
      }
    } else {
      slides[currentSlide - 1].style.removeProperty("z-index");

      for (let index = 0; index < slides.length; index++) {
        slides[index].removeAttribute("aria-hidden");
      }
    }
  });
})();
