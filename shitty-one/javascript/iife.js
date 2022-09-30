(function () {
  let prevSlide = 1;
  let currentSlide = 1;
  let canWheel = true;
  let canKeydown = true;

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
      const leftTranslateY = parseInt(leftSlide.style.transform.replace(/[^-\d.]/g, ""));
      const rightTranslateY = parseInt(rightSlide.style.transform.replace(/[^-\d.]/g, ""));
      const slideType = slides[index].dataset.slideType.toLowerCase();

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

    slides[currentSlide - 1].removeAttribute("style");

    if (direction === "bottom") {
      slides[currentSlide - 1].setAttribute("aria-hidden", true);
      slides[currentSlide - 1].nextElementSibling.removeAttribute("aria-hidden");
      navButtons[prevSlide - 1].classList.remove("dots-navigate__dot--active");

      currentSlide += 1;
      prevSlide = currentSlide;

      navButtons[currentSlide - 1].classList.add("dots-navigate__dot--active");
      navButtons[currentSlide - 1].focus();
    }

    if (direction === "top") {
      slides[currentSlide - 1].setAttribute("aria-hidden", true);
      slides[currentSlide - 1].previousElementSibling.removeAttribute("aria-hidden");
      navButtons[prevSlide - 1].classList.remove("dots-navigate__dot--active");

      currentSlide -= 1;
      prevSlide = currentSlide;

      navButtons[currentSlide - 1].classList.add("dots-navigate__dot--active");
      navButtons[currentSlide - 1].focus();
    }

    slides[currentSlide - 1].style.zIndex = "1";
  }

  // Handle more than one step sliding
  function multipleSliding(direction, slideComparison, recentSlide) {
    slides[currentSlide - 1].removeAttribute("style");

    // Sliding to bottom
    if (direction === "bottom") {
      for (let index = 0; index < slideComparison; index++) {
        for (let innerIndex = 0; innerIndex < totalSlide; innerIndex++) {
          const leftSlide = slides[innerIndex].firstElementChild;
          const rightSlide = slides[innerIndex].lastElementChild;
          const leftTranslateY = parseInt(leftSlide.style.transform.replace(/[^-\d.]/g, ""));
          const rightTranslateY = parseInt(rightSlide.style.transform.replace(/[^-\d.]/g, ""));
          const slideType = slides[innerIndex].dataset.slideType.toLowerCase();

          if (slideType === "multi") {
            leftSlide.style.transform = `translateY(${leftTranslateY - 100}%)`;
            rightSlide.style.transform = `translateY(${rightTranslateY + 100}%)`;
          }

          if (slideType === "full") {
            leftSlide.style.transform = `translateY(${leftTranslateY - 100}%)`;
          }
        }
      }

      slides[currentSlide - 1].setAttribute("aria-hidden", true);
      slides[recentSlide - 1].removeAttribute("aria-hidden");
      navButtons[prevSlide - 1].classList.remove("dots-navigate__dot--active");

      currentSlide = recentSlide;
      prevSlide = recentSlide;

      navButtons[currentSlide - 1].classList.add("dots-navigate__dot--active");
      navButtons[currentSlide - 1].focus();
    }

    // Sliding to top
    if (direction === "top") {
      for (let index = 0; index < slideComparison; index++) {
        for (let innerIndex = 0; innerIndex < totalSlide; innerIndex++) {
          const leftSlide = slides[innerIndex].firstElementChild;
          const rightSlide = slides[innerIndex].lastElementChild;
          const leftTranslateY = parseInt(leftSlide.style.transform.replace(/[^-\d.]/g, ""));
          const rightTranslateY = parseInt(rightSlide.style.transform.replace(/[^-\d.]/g, ""));
          const slideType = slides[innerIndex].dataset.slideType.toLowerCase();

          if (slideType === "multi") {
            leftSlide.style.transform = `translateY(${leftTranslateY + 100}%)`;
            rightSlide.style.transform = `translateY(${rightTranslateY - 100}%)`;
          }

          if (slideType === "full") {
            leftSlide.style.transform = `translateY(${leftTranslateY + 100}%)`;
          }
        }
      }

      slides[currentSlide - 1].setAttribute("aria-hidden", true);
      slides[recentSlide - 1].removeAttribute("aria-hidden");
      navButtons[prevSlide - 1].classList.remove("dots-navigate__dot--active");

      currentSlide = recentSlide;
      prevSlide = recentSlide;

      navButtons[currentSlide - 1].classList.add("dots-navigate__dot--active");
      navButtons[currentSlide - 1].focus();
    }

    slides[currentSlide - 1].style.zIndex = "1";
  }

  // Handle aria-hidden when comes to mobile view
  document.addEventListener("DOMContentLoaded", () => {
    if (window.innerWidth < MOBILE_SIZE) {
      for (let index = 0; index < slides.length; index++) {
        slides[index].removeAttribute("aria-hidden");
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

  // Buttons nav
  for (let navBtn = 0; navBtn <= navButtons.length - 1; navBtn++) {
    navButtons[navBtn].addEventListener("click", (event) => {
      if (window.innerWidth > MOBILE_SIZE) {
        const currentSlideSelected = parseInt(event.target.dataset.slideNav);
        const slideComparison = Math.abs(prevSlide - currentSlideSelected);

        // Slide to bottom
        if (currentSlide !== totalSlide && currentSlideSelected > prevSlide) {
          multipleSliding("bottom", slideComparison, currentSlideSelected);
        }

        // Slide to top
        if (currentSlide !== 1 && currentSlideSelected < prevSlide) {
          multipleSliding("top", slideComparison, currentSlideSelected);
        }
      }
    });
  }

  // Mouse wheel
  body.addEventListener(
    "wheel",
    (event) => {
      if (window.innerWidth > MOBILE_SIZE) {
        if (canWheel === true) {
          const scrollValue = event.deltaY;

          canWheel = false;

          // Scroll to bottom
          if (currentSlide !== totalSlide && scrollValue > 0) {
            oneStepSliding("bottom");
          }

          // Scroll to top
          if (currentSlide !== 1 && scrollValue < 0) {
            oneStepSliding("top");
          }

          setTimeout(() => {
            canWheel = true;
          }, 700);
        }
      }
    },
    { passive: true }
  );

  // Keyboard interactions
  body.addEventListener("keydown", (event) => {
    if (window.innerWidth >= MOBILE_SIZE) {
      if (canKeydown === true) {
        const key = event.key.toLowerCase();

        canKeydown = false;

        // End
        if (currentSlide !== totalSlide && key === "end") {
          const slideComparison = Math.abs(prevSlide - totalSlide);
          multipleSliding("bottom", slideComparison, totalSlide);
        }

        // Home
        if (currentSlide !== 1 && key === "home") {
          const slideComparison = Math.abs(prevSlide - 1);
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
          canKeydown = true;
        }, 700);
      }
    }
  });
})();
