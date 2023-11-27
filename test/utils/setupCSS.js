const CSS_TEXT_CORE = `
   *,
   *::before,
   *::after {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
   }

   body {
      width: 100vw;
      height: 100vh;
      overflow-y: hidden;
      overflow-x: hidden;
   }

   .mys-multiscroll-nav {
      --mys-multiscroll-nav-btn-transition-duration: 610ms;
   }

   .mys-multiscroll-slide-container {
      --mys-multiscroll-slide-transition-duration: 610ms;

      position: relative;
   }

   .mys-multiscroll-slide {
      position: absolute;
   }

   .mys-multiscroll-slide,
   .mys-multiscroll-slide-container {
      width: 100%;
      height: 100%;
   }

   .mys-multiscroll-slide[data-mys-multiscroll-slide-type="multi"] {
      display: flex;
   }

   .mys-multiscroll-slide__full {
      width: 100%;
   }

   .mys-multiscroll-slide__multi {
      width: 50%;
   }

   .mys-multiscroll-slide__full,
   .mys-multiscroll-slide__multi {
      height: 100%;
      position: relative;
      transition: transform var(--mys-multiscroll-slide-transition-duration) ease-in-out;
   }

   @media screen and (max-width: 768px) {
      body {
         width: auto;
         height: auto;
         overflow-y: visible;
      }

      .mys-multiscroll-slide {
         z-index: auto;
         position: static;
      }

      .mys-multiscroll-slide[data-mys-multiscroll-slide-type="multi"] {
         display: block;
      }

      .mys-multiscroll-slide__full,
      .mys-multiscroll-slide__multi {
         width: 100%;
         height: auto;
         position: static;
         transform: translateY(0%) !important;
      }
   }
`.trim();

const CSS_TEXT_SLIDES = `
   .mys-multiscroll-slide__content {
      width: 100%;
      color: #fff;
      height: 100%;
      display: flex;
      font-size: 44px;
      align-items: center;
      justify-content: center;
      text-shadow: 1px 2px 3px #000;
      font-family: Arial, Helvetica, sans-serif;
   }

   .slide-0-full {
      background-color: #008000;
   }

   .slide-2-full {
      background-color: #4169e1;
   }

   .slide-6-full {
      background-color: #7a2d2d;
   }

   .slide-7-full {
      background-color: #735959;
   }

   .slide-1-left {
      background-color: #ff0000;
   }

   .slide-1-right {
      background-color: #0abbbb;
   }

   .slide-3-left {
      background-color: #0000ff;
   }

   .slide-3-right {
      background-color: #a52a2a;
   }

   .slide-4-left {
      background-color: #0da7aa;
   }

   .slide-4-right {
      background-color: #008000;
   }

   .slide-5-left {
      background-color: #59594f;
   }

   .slide-5-right {
      background-color: #1bec1b;
   }

   .slide-6-left {
      background-color: #383833;
   }

   .slide-6-right {
      background-color: #472f7a;
   }

   .slide-8-left {
      background-color: #b6b634;
   }

   .slide-8-right {
      background-color: #260e5a;
   }

   .slide-9-left {
      background-color: #6b6b3d;
   }

   .slide-9-right {
      background-color: #c26778;
   }

   .slide-10-left {
      background-color: #3d3d14;
   }

   .slide-10-right {
      background-color: #7f7577;
   }

   .slide-11-left {
      background-color: #dfdf1b;
   }

   .slide-11-right {
      background-color: #0000ff;
   }
`;

const CSS_TEXT_SLIDE_NAV_BUTTONS = `
   .mys-multiscroll-nav {
      top: 0;
      right: 0;
      gap: 14px;
      z-index: 2;
      height: 100%;
      display: flex;
      position: fixed;
      margin-right: 52px;
      align-items: center;
      flex-direction: column;
      justify-content: center;
      font-family: Arial, Helvetica, sans-serif;
   }

   .mys-multiscroll-nav__btn {
      width: 13px;
      height: 13px;
      cursor: pointer;
      border-radius: 100%;
      border: 2px solid #292323;
      transition: background-color var(--mys-multiscroll-nav-btn-transition-duration), transform var(--mys-multiscroll-nav-btn-transition-duration);
   }

   .mys-multiscroll-nav__btn--active {
      transform: scale(1.4);
      background-color: #292323;
   }

   @media screen and (max-width: 768px) {
      .mys-multiscroll-nav {
         display: none;
      }
   }
`.trim();

const CSS_TEXT_CODE = CSS_TEXT_CORE + CSS_TEXT_SLIDES + CSS_TEXT_SLIDE_NAV_BUTTONS;

function injectCSS() {
	const styleElement = document.createElement("style");
	styleElement.setAttribute("type", "text/css");
	styleElement.appendChild(document.createTextNode(CSS_TEXT_CODE));

	document.head.appendChild(styleElement);
}

export default injectCSS;
