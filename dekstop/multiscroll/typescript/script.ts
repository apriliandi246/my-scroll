/*
=> Resourse for HTML Interface:
  => https://developer.mozilla.org/en-US/docs/Web/API/Element
  => https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement
  => https://www.w3.org/TR/DOM-Level-3-Core/core.html#ID-1950641247
*/

/*
=> Strategies:
  => For DOM manipulation, the data type based HTML interface. So Typescript will check
     if some property or method we use from some HTML element it's avaiable or not.

  => For common data type, 
*/

class Multiscroll {
  private mobileSize: number;
  private totalSlides: number;
  private currentSlide: number;
  private slides: HTMLCollection;
  private totalNavButtons: number;
  private isWheelEventDelay: boolean;
  private navButtons: HTMLCollection;
  private navDatasetAttribute: string;
  private transitionDelayTime: number;
  private isKeyboardEventDelay: boolean;
  private slideDatasetAttribute: string;
  private activeNavBtnClassname: string;
  private cssVariableTransitionDelay: string;

  constructor() {
    this.currentSlide = 0;
    this.mobileSize = 992;
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

    this.main();
  }

  /*
    Default viewport size is 992.
    "mobileSize" it's when the app becomes mobile vide mode.
  */
  public setMobileViewportSize(viewportSize: number): void {
    this.mobileSize = viewportSize;
  }

  private main(): void {
    this.navButtonsFirstRender();
    this.slideFirstRender();
    this.setAriaHiddenWhileResizing();
    this.navigateNavButtons();
    this.navigateMouseScroll();
    this.navigateKeyboard();
  }

  private navButtonsFirstRender(): void {
    for (let index = 0; index < this.totalNavButtons; index++) {
      const navButton = this.navButtons[index] as HTMLButtonElement;

      navButton.setAttribute(this.navDatasetAttribute, `${index}`);
      navButton.setAttribute("aria-label", `to slide ${index}`);
    }
  }

  private slideFirstRender(): void {
    const documentEl = document.documentElement as Element;
    const transitionCSSVar: string = getComputedStyle(documentEl).getPropertyValue(this.cssVariableTransitionDelay);
    const transitionDelayTimeValue: number = parseInt(transitionCSSVar);

    this.transitionDelayTime = transitionDelayTimeValue;

    for (let index = 0; index < this.totalSlides; index++) {
      const slide = this.slides[index] as HTMLDivElement;
      const leftSlideContent = slide.firstElementChild as HTMLDivElement;
      const rightSlideContent = slide.lastElementChild as HTMLDivElement;
      const totalSlideContent: number = slide.childElementCount;

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
        slide.style.zIndex = "1";

        for (let index = 0; index < this.totalSlides; index++) {
          const slide = this.slides[index] as HTMLDivElement;

          if (index === 0) {
            slide.setAttribute("aria-hidden", "false");
          }

          if (index !== 0) {
            slide.setAttribute("aria-hidden", "true");
          }
        }
      }

      if (window.innerWidth < this.mobileSize) {
        for (let index = 0; index < this.totalSlides; index++) {
          const slide = this.slides[index] as HTMLDivElement;
          slide.removeAttribute("aria-hidden");
        }
      }
    }
  }

  private setAriaHiddenWhileResizing(): void {
    window.addEventListener("resize", () => {
      const currentSlide = this.slides[this.currentSlide] as HTMLDivElement;

      if (window.innerWidth > this.mobileSize) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        currentSlide.style.zIndex = "1";

        for (let index = 0; index < this.totalSlides; index++) {
          const slide = this.slides[index] as HTMLDivElement;

          if (this.currentSlide === index) {
            slide.setAttribute("aria-hidden", "false");
          }

          if (this.currentSlide !== index) {
            slide.setAttribute("aria-hidden", "true");
          }
        }
      } else {
        currentSlide.style.zIndex = "";

        for (let index = 0; index < this.totalSlides; index++) {
          const slide = this.slides[index] as HTMLDivElement;
          slide.removeAttribute("aria-hidden");
        }
      }
    });
  }

  private navigateNavButtons(): void {
    for (let index = 0; index < this.totalNavButtons; index++) {
      const navButton = this.navButtons[index] as HTMLButtonElement;

      navButton.addEventListener("click", () => {
        if (this.isWheelEventDelay === true) {
          if (window.innerWidth > this.mobileSize) {
            const slideNavNumber: string = navButton.getAttribute(this.navDatasetAttribute)!;
            const slideSelected: number = parseInt(slideNavNumber);
            const slideComparison: number = Math.abs(this.currentSlide - slideSelected);

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
      });
    }
  }

  private navigateMouseScroll(): void {
    window.addEventListener(
      "wheel",
      (event) => {
        if (this.isWheelEventDelay === true) {
          if (window.innerWidth > this.mobileSize) {
            const scrollValue: number = event.deltaY;

            if (this.currentSlide !== this.totalSlides - 1 && scrollValue > 0) {
              this.oneTimeNavigate("bottom");
            }

            if (this.currentSlide !== 0 && scrollValue < 0) {
              this.oneTimeNavigate("top");
            }
          }
        }
      },
      { passive: true }
    );
  }

  private navigateKeyboard(): void {
    window.addEventListener("keydown", (event) => {
      if (window.innerWidth >= this.mobileSize) {
        if (this.isKeyboardEventDelay === true) {
          const keyboardKey: string = event.key.toLowerCase();

          this.isKeyboardEventDelay = false;

          if (this.currentSlide !== this.totalSlides - 1 && keyboardKey === "end") {
            const slideComparison: number = Math.abs(this.currentSlide - this.totalSlides);
            this.multipleTimeNavigate("bottom", slideComparison, this.totalSlides);
          }

          if (this.currentSlide !== 0 && keyboardKey === "home") {
            const slideComparison: number = Math.abs(this.currentSlide - 1);
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

  private oneTimeNavigate(direction: string) {
    this.isWheelEventDelay = false;

    for (let index = 0; index < this.totalSlides; index++) {
      const slideType: string = this.slides[index].getAttribute(this.slideDatasetAttribute)!;

      if (slideType === "multi") {
        const leftSlide = this.slides[index].firstElementChild as HTMLDivElement;
        const rightSlide = this.slides[index].lastElementChild as HTMLDivElement;
        const translateYLeftSlide: number = parseInt(leftSlide.style.transform.replace(/[^-\d.]/g, ""));
        const translateYRightSlide: number = parseInt(rightSlide.style.transform.replace(/[^-\d.]/g, ""));

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
        const fullSlide = this.slides[index].firstElementChild as HTMLDivElement;
        const translateYFullSlide: number = parseInt(fullSlide.style.transform.replace(/[^-\d.]/g, ""));

        if (direction === "bottom") {
          fullSlide.style.transform = `translateY(${translateYFullSlide - 100}%)`;
        }

        if (direction === "top") {
          fullSlide.style.transform = `translateY(${translateYFullSlide + 100}%)`;
        }
      }
    }

    let currentSlide = this.slides[this.currentSlide] as HTMLDivElement;
    let currentNavButton = this.navButtons[this.currentSlide] as HTMLButtonElement;

    currentSlide.style.zIndex = "";
    currentSlide.setAttribute("aria-hidden", "true");

    if (direction === "bottom") {
      const nextElement = currentSlide.nextElementSibling as HTMLDivElement;

      nextElement.setAttribute("aria-hidden", "false")!;
      currentNavButton.classList.remove(this.activeNavBtnClassname);
      this.currentSlide += 1;
    }

    if (direction === "top") {
      const prevElement = currentSlide.previousElementSibling as HTMLDivElement;

      prevElement.setAttribute("aria-hidden", "false");
      currentNavButton.classList.remove(this.activeNavBtnClassname);
      this.currentSlide -= 1;
    }

    currentSlide = this.slides[this.currentSlide] as HTMLDivElement;
    currentNavButton = this.navButtons[this.currentSlide] as HTMLButtonElement;

    currentNavButton.classList.add(this.activeNavBtnClassname);
    currentNavButton.focus();

    setTimeout(() => {
      currentSlide.style.zIndex = "1";
      this.isWheelEventDelay = true;
    }, this.transitionDelayTime);
  }

  private multipleTimeNavigate(direction: string, slideComparison: number, choosenSlide: number) {
    let currentSlide = this.slides[this.currentSlide] as HTMLDivElement;

    this.isWheelEventDelay = false;
    currentSlide.style.zIndex = "";

    for (let index = 0; index < slideComparison; index++) {
      for (let innerIndex = 0; innerIndex < this.totalSlides; innerIndex++) {
        const slide = this.slides[innerIndex] as HTMLDivElement;
        const slideType: string = slide.getAttribute(this.slideDatasetAttribute)!;

        if (slideType === "multi") {
          const leftSlide = slide.firstElementChild as HTMLDivElement;
          const rightSlide = slide.lastElementChild as HTMLDivElement;
          const translateYLeftSlide: number = parseInt(leftSlide.style.transform.replace(/[^-\d.]/g, ""));
          const translateYRightSlide: number = parseInt(rightSlide.style.transform.replace(/[^-\d.]/g, ""));

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
          const fullSlide = this.slides[innerIndex].firstElementChild as HTMLDivElement;
          const translateYFullSlide: number = parseInt(fullSlide.style.transform.replace(/[^-\d.]/g, ""));

          if (direction === "top") {
            fullSlide.style.transform = `translateY(${translateYFullSlide + 100}%)`;
          }

          if (direction === "bottom") {
            fullSlide.style.transform = `translateY(${translateYFullSlide - 100}%)`;
          }
        }
      }
    }

    let currentNavButton = this.navButtons[this.currentSlide] as HTMLButtonElement;

    this.slides[choosenSlide].setAttribute("aria-hidden", "false");
    currentSlide.setAttribute("aria-hidden", "true");
    currentNavButton.classList.remove(this.activeNavBtnClassname);

    this.currentSlide = choosenSlide;
    currentSlide = this.slides[this.currentSlide] as HTMLDivElement;
    currentNavButton = this.navButtons[this.currentSlide] as HTMLButtonElement;

    currentNavButton.classList.add(this.activeNavBtnClassname);
    currentNavButton.focus();

    setTimeout(() => {
      currentSlide.style.zIndex = "1";
      this.isWheelEventDelay = true;
    }, this.transitionDelayTime);
  }
}
